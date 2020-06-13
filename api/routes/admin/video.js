const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csv = require('csvtojson');

const { decodeString } = require('../../modules');

const router = express.Router();


router.get('/all', (req, res) => {
    let token = req.headers['authorization'];
    var request = require('request');
    var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
    var headers = { 
      Authorization: `${token}`
    };
    // request.get({ url: url,  headers: headers }, function (e, r, body) {
    //     if(!e && r.statusCode == 200) {
            req.getConnection((err, conn) => {
                if (err) return res.sendStatus(400);
                conn.query(`
                    SELECT videos.*, T.playlist_ids FROM videos
                        LEFT JOIN (
                            SELECT video_id, GROUP_CONCAT(playlist_id) playlist_ids FROM playlist_data
                                GROUP BY video_id
                            ) AS T
                        ON videos.id = T.video_id
                `, (err, rows) => {
                    if (err) return res.sendStatus(400);
                    const videos = rows.map(({ playlist_ids, video_title, ...rest }) => {
                        const playlists = playlist_ids ? playlist_ids.split(',').map(id => +id) : [];
                        return {
                            ...rest,
                            video_title: decodeString(video_title),
                            playlists
                        }
                    });
                    res.send({
                        videos
                    })
                })
            })
    //     }
    //     else {
    //         res.send({ status: 401, message: 'Unauthorized request!'});
    //     }
    // });
})

router.post('/validate', (req, res) => {
   
    const { link } = req.body;
    let token = req.headers['authorization'];
    var request = require('request');
    var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
    var headers = { 
      Authorization: `${token}`
    };
    // request.get({ url: url,  headers: headers }, function (e, r, body) {
    //     if(!e && r.statusCode == 200) {
            req.getConnection((err, conn) => {
                if (err) {
                    return res.send({
                        error: true
                    });
                }
                conn.query(`SELECT id FROM videos WHERE interface_link='${link}'`, (err, rows) => {
                    if (err) {
                        return res.send({
                            error: true
                        });
                    }
                    if (rows.length > 0) {
                        return res.send({
                            status: 2
                        })
                    }
                    const type = validateLink({link});
                    if (type === null) {
                        return res.send({
                            status: 1
                        })
                    }
                    generateGSVN(conn, (err, gsvn) => {
                        if (err) return res.sendStatus(400);
                        res.send({
                            status: 0,
                            gsvn,
                            type,
                        });
                    });
                })
            });
    //     }
    //     else {
    //         res.send({ status: 401, message: 'Unauthorized request!'});
    //     }
    // });
})

const validateLink = (data) => {
    const video_types = [
        {
            regex: /(http|https):\/\/www.ustream.tv\/embed\/\d+\?html5ui/,
            type: 'ustream'
        },
        {
            regex: /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=/,
            type: 'youtube'
        },
        {
            regex: /facebook\.com\/([^/?].+\/)?video(s|\.php)[/?].*$/,
            type: 'facebook'
        },
        {
            regex: /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?$/,
            type: 'dailymotion'
        },
        {
            regex: /(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/,
            type: 'twitch'
        },
        {
            regex: /vimeo\.com\/.+/,
            type: 'vimeo'
        },
        {
            regex: /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/(.*)$/,
            type: 'wista'
        }
    ];
    let type = null;
    for (let i = 0; i < video_types.length; i ++) {
        if (video_types[i].regex.test(data.link)) {
            type = video_types[i].type;
            break;
        }
    }
    if (type) {
        let { link } = data;
        switch(type) {
            case 'youtube':
                let video_id;
                let pos = -1;
                if (link.indexOf('https://') !== -1) link = link.slice(8);
                if (link.indexOf('http://') !== -1) link = link.slice(7);
                if (link.indexOf('www.youtube.com/watch?v=') !== -1) {
                    link = link.slice(24);
                    pos = link.indexOf('#');
                    if (pos === -1) pos = link.indexOf('&');
                } else if (link.indexOf('youtu.be/') !== -1) {
                    link = link.slice(9);
                    pos = link.indexOf('?');
                } else if (link.indexOf('www.youtube.com/embed/') !== -1) {
                    link = link.slice(22);
                    pos = link.indexOf('?');
                }
                if (pos !== -1) link = link.slice(0, pos);
                video_id = link;
                data.link = `https://www.youtube.com/watch?v=${video_id}`;
                break;
        }
        return type;
    }
    return type;
}

const generateGSVN = (conn, callback) => {
    let gsvn = 'GSVN18'
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 24; i ++) {
        gsvn += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    conn.query(`SELECT COUNT(*) FROM videos WHERE gsvn='${gsvn}'`, (err, rows) => {
        if (err) return callback(err);
        const count = rows[0]['COUNT(*)']
        if (count !== 0) {
            generateGSVN(conn, callback);
        } else {
            callback(null, gsvn);
        }
    })
}

router.post('/', (req, res) => {
    const { video } = req.body;
    video.video_title = encodeURI(video.video_title);
    var date = new Date();
    date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() ;
    req.getConnection((err, conn) => {
        if (err) return res.sendStatus(400);
        const isNew = video.id === undefined;
        if (isNew) {
            const fields = [
                'gsvn',
                'video_type',
                'video_id',
                'interface_link',
                'video_title',
                'video_author',
                'description',
                'episode_title',
                'thumbnail',
                'tags',
                'gotags',
                'category',
                'note',
                'video_length',
                'channel',
                'dead',
                'embed_restricted',
                'ptll',
                'live_now',
                'author_link',
                'author_img',
                'dateAdded',
                'dateAddedUserId',
            ];
            const values = [];
            generateGSVN(conn, (err, gsvn) => {
                if (err) return callback(err);
                fields.map(field => values.push(video[field] || null));
                values[0] = gsvn;
                values [15] = 0;
                values[21] = date
                values[22] = null;
                conn.query(`INSERT INTO videos(gsvn, video_type, video_id, interface_link, video_title, video_author, description, episode_title, thumbnail, tags, gotags, category, note, video_length, channel, dead, embed_restricted, ptll, live_now, author_link, author_img, dateAdded, dateAddedUserId) VALUES(?)`, [values] , (err, rows) => {
                    if (err) { console.log(err); res.sendStatus(400); }
                    video.id = rows.insertId;
                    res.send({
                        success: true,
                        video
                    });
                })
            })
            
        } else {
            const fields = [
                'video_type',
                'video_id',
                'video_title',
                'video_author',
                'description',
                'episode_title',
                'thumbnail',
                'tags',
                'gotags',
                'category',
                'note',
                'channel',
                'embed_restricted',
                'ptll',
                'live_now',
                'author_link',
                'author_img',
            ];
            const query = 'UPDATE videos SET ' + fields.map(field => `${field} = ${JSON.stringify(video[field] || null)}`).join(', ') + `, video_length = ${video.video_length} WHERE id='${video.id}'`;
            conn.query(query, (err) => {
                if (err)
                {
                    return res.sendStatus(400);
                }
                res.send({
                    success:true,
                    video
                });
            });
        }
    });
})

router.post('/bulk', (req, res) => {
    
    var storage = multer.diskStorage({
        destination: 'csv',
        filename: function (req1, file, cb) {
            cb(null, 'videos.csv')
        }
    });
    var upload = multer({ storage: storage }).any();
    let token = req.headers['authorization'];
    var request = require('request');
    var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
    var headers = { 
      Authorization: `${token}`
    };
    // request.get({ url: url,  headers: headers }, function (e, r, body) {
    //     if(!e && r.statusCode == 200) {
            upload(req, res, async (err) => {
                if (err) res.status(200);
                const file = req.files[0].path;
                let videos;
                videos = await csv().fromFile(file);
                req.getConnection((err, conn) => {
                    if (err) res.status(200);
                    let filteredVideos = videos.filter(video => video.GSPN !== '');
                    const videoGroups = filteredVideos.reduce(function (r, a) {
                        r[a.GSPN] = r[a.GSPN] || [];
                        r[a.GSPN].push(a);
                        return r;
                    }, Object.create(null));
                    let status = {};
                    const gspns = Object.keys(videoGroups);
                    gspns.map((gspn, gspnIndex) => {
                        const group = videoGroups[gspn];
                        const count = group.length;
                        let innerCompleted = 0;
                        let duplicate = 0;
                        const added = new Array(group.length).fill(false);
                        conn.query(`UPDATE playlist_data SET playlist_order = playlist_order + ${count} WHERE playlist_id = (SELECT id FROM playlists WHERE gspn = '${gspn}')`, () => {
                            group.map((video, order) => {
                                saveVideo(video, -order, conn, (err, isDuplicate = false) => {
                                    if (err) {
                                        return res.status(200);
                                    }
                                    status[video.interface_link] = isDuplicate;
                                    if (isDuplicate) duplicate ++;
                                    else added[order] = true;
                                    innerCompleted++;
                                    if (innerCompleted === count) {
                                        conn.query(`UPDATE playlist_data SET playlist_order = playlist_order - ${duplicate} WHERE playlist_order >= ? AND playlist_id = (SELECT id FROM playlists WHERE gspn = ?)`, [count, gspn], () => {
                                            if (duplicate !== count) {
                                                innerCompleted = 0;
                                                let newOrder = 0;
                                                added.map((isNew, index) => {
                                                    if (isNew) {
                                                        conn.query(`UPDATE playlist_data SET playlist_order = ? WHERE playlist_order = ? AND playlist_id = (SELECT id FROM playlists WHERE gspn = ?)`, [newOrder, -index, gspn], () => {
                                                            innerCompleted++;
                                                            if (innerCompleted === count - duplicate && gspnIndex === gspns.length - 1) {
                                                                const logs = videos.map(video => {
                                                                    let message;
                                                                    if (status[video.interface_link] === undefined) {
                                                                        message = 'Unable to save video';
                                                                    } else if (status[video.interface_link]) {
                                                                        message = 'Video updated successfully';
                                                                    } else {
                                                                        message = 'Video added successfully';
                                                                    }
                                                                    return `'${video.interface_link}' : ${message}`;
                                                                });
        
                                                                fs.unlink(file, () => {
                                                                    res.send({
                                                                        success: true,
                                                                        logs
                                                                    });
                                                                });
                                                            }
                                                        });
                                                        newOrder++;
                                                    }
                                                });
                                            } else if (gspnIndex === gspns.length - 1) {
                                                const logs = videos.map(video => {
                                                    let message;
                                                    if (status[video.interface_link] === undefined) {
                                                        message = 'Unable to save video';
                                                    } else if (status[video.interface_link]) {
                                                        message = 'Video updated successfully';
                                                    } else {
                                                        message = 'Video added successfully';
                                                    }
                                                    return `'${video.interface_link}' : ${message}`;
                                                });
                                                fs.unlink(file, () => {
                                                    res.send({
                                                        success: true,
                                                        logs
                                                    });
                                                });
                                            }
                                        });
                                    }
                                })
                            })
                        })
                    })
                });
            });
    //     }
    //     else {
    //         res.send({ status: 401, message: 'Unauthorized request!'});
    //     }
    // });
})

const convertTimeStringToSecs = (timeStr) => {
    const val = timeStr.split(':');
    const count = val.length;
    let res = 0;
    for (let i = 0; i < count; i ++) {
        res = res * 60 + (+val[i]);
    }
    if (isNaN(res)) return -1;
    return res;
}

const saveVideo = (video, order, conn, callback) => {
    let { GSPN, video_type, video_id, interface_link, video_title, video_author, video_length, description, episode_title, thumbnail, tags, gotags, category, note } = video;
    video_length = convertTimeStringToSecs(video_length);
    const channel = video['Channel Stream?'] === 'Y';
    const dead = video['DEAD?'] === 'Y';
    const embed_restricted = video['NO Embed?'] === 'Y';
    const ptll = video['PTLL?'] === 'Y';
    const live_now = video['Live Now?'] === 'Y';
    const data = { link: interface_link };
    validateLink(data);
    interface_link = data.link;
    generateGSVN(conn, (err, gsvn) => {
        if (err) return callback(err);
        conn.query('SELECT * FROM videos WHERE interface_link = ?', interface_link, (err, rows) => {
            if (err) return callback(err);
            if (rows.length === 0) {
                // new video
                const values = [gsvn, video_type, video_id, interface_link, encodeURI(video_title), video_author,
                    video_length, description, episode_title, thumbnail, tags, gotags, category, note, channel, dead, embed_restricted,
                    ptll, live_now];
                conn.query(`INSERT INTO videos (gsvn, video_type, video_id, interface_link, video_title, video_author, video_length, description,episode_title, thumbnail, tags, gotags, category, note, channel, dead, embed_restricted, ptll, live_now) VALUES (?)`, [values], (err, rows) => {
                    if (err) return callback(err);
                    const id = rows.insertId;
                    conn.query(`INSERT INTO playlist_data (playlist_id, playlist_order, video_id) VALUES ((SELECT id FROM playlists WHERE gspn='${GSPN}'), ${order}, ${id})`, (err) => callback(err));
                });
            } else {
                // video already exists
                const values = [video_type, video_id, video_author, encodeURI(video_title), description, episode_title, thumbnail, tags,
                    gotags, category, note, video_length, channel, dead, embed_restricted, ptll, live_now, interface_link];
                conn.query(`UPDATE videos SET video_type = ?, video_id = ?, video_author = ?, video_title = ?,
                        description = ?, episode_title = ?, thumbnail = ?, tags = ?, gotags = ?, category = ?, note = ?, video_length = ?,
                        channel = ?, dead = ?, embed_restricted = ?, ptll = ?, live_now = ? WHERE interface_link = ?`, values, () => {
                    callback(null, true);
                });
            }
        });
    })
}

router.post('/playlists', (req, res) => {
    const { video_id } = req.body;
    let token = req.headers['authorization'];
    var request = require('request');
    var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
    var headers = { 
      Authorization: `${token}`
    };
    // request.get({ url: url,  headers: headers }, function (e, r, body) {
    //     if(!e && r.statusCode == 200) {
            req.getConnection((err, conn) => {
                if (err) return res.sendStatus(400);
                conn.query(`SELECT pl.*, IF(pd.playlist_id IS NULL, false, true) include FROM playlists pl LEFT JOIN playlist_data pd on pl.id=pd.playlist_id and pd.video_id=${video_id} ORDER BY pl.id ASC`, (err, rows) => {
                    if (err) return res.sendStatus(400);
                    res.send({
                        playlists: rows
                    });
                })
            });
    //     }
    //     else {
    //         res.send({ status: 401, message: 'Unauthorized request!'});
    //     }
    // });
})

router.post('/addtoplaylist', (req, res) => {
   
    const { video_id, playlist_id } = req.body;
    
    req.getConnection((err, conn) => {
        if (err) return res.sendStatus(400);
        conn.query(`UPDATE playlist_data SET playlist_order = playlist_order + 1 WHERE playlist_id = '${playlist_id}'`, (err) => {
            if (err) return res.sendStatus(400);
            conn.query(`INSERT INTO playlist_data (playlist_id, video_id) VALUES ('${playlist_id}', '${video_id}')`, (err) => {
                if (err) return res.sendStatus(400);
                res.send({
                    success: true
                });
            })
        })
    })
})

router.post('/removefromplaylist/:userId', (req, res) => {
    const { video_id, playlist_id } = req.body;
    const { userId } = req.params;
    let token = req.headers['authorization'];
    var request = require('request');
    var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
    var headers = { 
      Authorization: `${token}`
    };
    // request.get({ url: url,  headers: headers }, function (e, r, body) {
    //     if(!e && r.statusCode == 200) {
            req.getConnection((err, conn) => {
                if (err) return res.sendStatus(400);
                conn.query('SELECT playlist_order FROM user_info WHERE video_id = ? AND playlist_id = ? AND user_id = ?', [video_id, playlist_id, userId], (err, rows) => {
                    if (err) return res.sendStatus(400);
                    const order = rows[0].playlist_order;
                    conn.query('UPDATE user_info SET playlist_order = playlist_order - 1 WHERE playlist_id = ? AND playlist_order > ? AND user_id = ?', [playlist_id, order, userId], (err, rows) => {
                        if (err) return res.sendStatus(400);
                        conn.query('DELETE FROM user_info WHERE video_id = ? AND playlist_id = ? AND user_id = ?', [video_id, playlist_id , userId], (err) => {
                            if (err) return res.sendStatus(400);
                            res.send({
                                success: true
                            });
                        })
                    })
                })
            })
    //     }
    //     else {
    //         res.send({ status: 401, message: 'Unauthorized request!'});
    //     }
    // });
});

router.post('/remove', (req, res) => {
    
    const { video_id } = req.body;
    let token = req.headers['authorization'];
    var request = require('request');
    var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
    var headers = { 
      Authorization: `${token}`
    };
    // request.get({ url: url,  headers: headers }, function (e, r, body) {
    //     if(!e && r.statusCode == 200) {
            req.getConnection((err, conn) => {
                if (err) return res.sendStatus(400);
                conn.query('SELECT playlist_id, playlist_order FROM playlist_data WHERE video_id = ?', [video_id], (err, rows) => {
                    if (err) return res.sendStatus(400);
                    let completed = 0;
                    if (rows.length > 0) {
                        rows.map(row => {
                            const { playlist_id, playlist_order } = row;
                            conn.query('UPDATE playlist_data SET playlist_order = playlist_order - 1 WHERE playlist_id = ? AND playlist_order > ?',[playlist_id, playlist_order], (err) => {
                                if (err) return res.sendStatus(400);
                                completed ++;
                                if (completed === rows.length) {
                                    conn.query('DELETE FROM playlist_data WHERE video_id = ?', [video_id], (err) => {
                                        if (err) return res.sendStatus(400);
                                        conn.query('DELETE FROM videos WHERE id = ?', [video_id], (err) => {
                                            if (err) return res.sendStatus(400);
                                            res.send({
                                                success: true
                                            });
                                        });
                                    });
                                }
                            });
                        })
                    } else {
                        conn.query('DELETE FROM videos WHERE id = ?', [video_id], (err) => {
                            if (err) return res.sendStatus(400);
                            res.send({
                                success: true
                            });
                        });
                    }
                })
            })
    //     }
    //     else {
    //         res.send({ status: 401, message: 'Unauthorized request!'});
    //     }
    // });
});

router.post('/removeUserVideo', (req, res) => {
    
    const { user_id, gspn, video_id } = req.body;
    req.getConnection((err, conn) => {
        if (err) return res.sendStatus(400);
        conn.query(`SELECT id FROM playlists WHERE gspn = '${gspn}'`, (err, rows) => {
            const playlist_id = rows[0].id;
            req.getConnection((err, conn) => {
                if (err) return res.sendStatus(400);
                conn.query('SELECT playlist_order FROM user_info WHERE video_id = ? AND playlist_id = ? AND user_id = ?', [video_id, playlist_id, user_id], (err, rows) => {
                    if (err) return res.sendStatus(400);
                    const order = rows[0].playlist_order;
                    conn.query('UPDATE user_info SET playlist_order = playlist_order - 1 WHERE playlist_id = ? AND playlist_order > ? AND user_id = ?', [playlist_id, order, user_id], (err, rows) => {
                        if (err) return res.sendStatus(400);
                        conn.query('DELETE FROM user_info WHERE video_id = ? AND playlist_id = ? AND user_id = ?', [video_id, playlist_id , user_id], (err) => {
                            if (err) return res.sendStatus(400);
                            res.send({
                                success: true
                            });
                        })
                    })
                })
            })
        })
    })
});

router.post('/userVideo', (req, res) => {
    const { user_id, gspn } = req.body; 
    req.getConnection((err, conn) => {
        if (err) return res.sendStatus(400);
        conn.query(`SELECT id FROM playlists WHERE gspn = '${gspn}'`, (err, rows) => {
            if (err) return res.sendStatus(400);
            const playlist_id = rows[0].id;
            conn.query(`SELECT videos.* , dotted, hidden, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = ${playlist_id} AND pd.user_id = ${user_id} ORDER BY pd.playlist_order`, (err, rows) => {
                if (err) return res.sendStatus(400);
                const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored }) => ({
                    id: id,
                    gsvn : gsvn,
                    url: video_id,
                    interface_link: interface_link,
                    title: decodeString(video_title),
                    description,
                    type: video_type,
                    author: video_author,
                    thumb : thumbnail,
                    tags : tags, 
                    gotags : gotags, 
                    category : category,
                    author_img : author_img,
                    authorLink : author_link,
                    length: video_length,
                    dotted: dotted,
                    hidden: hidden,
                    order: playlist_order,
                    episode_title:episode_title,
                    sponsored : sponsored
                }))
                res.send({ videos });
            });
        })
        
    })
})

router.post('/updateCheck', (req, res) => {
    const { dotted, hidden, user_id, gspn, id } = req.body; 
    req.getConnection((err, conn) => {
        if (err) return res.sendStatus(400);
        conn.query(`SELECT id FROM playlists WHERE gspn = '${gspn}'`, (err, rows) => {
            const playlist_id = rows[0].id;
            conn.query(`UPDATE user_info SET dotted = ${dotted}, hidden = ${hidden} WHERE user_id = ${user_id} AND playlist_id = ${playlist_id} AND video_id = ${id}`, (err) => {
                if (err) return res.sendStatus(400);
                res.send({
                    success : true
                })
            });
        })
    })
})

router.post('/resetDefault', (req, res) => {
    const { user_id, gspn } = req.body; 
    req.getConnection((err, conn) => {
        if (err) return res.sendStatus(400);
        conn.query(`SELECT id FROM playlists WHERE gspn = '${gspn}'`, (err, rows) => {
            const playlist_id = rows[0].id;
            conn.query(`DELETE FROM user_info WHERE user_id=${user_id} AND playlist_id=${playlist_id}`, (err) => {
                if (err) return res.sendStatus(400);
                conn.query(`SELECT video_id, playlist_order FROM playlist_data WHERE playlist_id=${playlist_id}`,(err, rows) => {
                    if (err) return res.sendStatus(400);
                    else if(rows.length === 0) {
                        res.send({ videos : null})
                    }
                    else {
                        var data = [];
                        rows.map(row=>{
                            data.push([user_id, playlist_id, row.video_id, row.playlist_order, 0, 0]);
                        })
                        conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order, hidden, dotted) VALUES ?', [data], (err, rows) => {
                            if (err) { console.log(err); return res.sendStatus(400);}
                            conn.query(`SELECT videos.* , dotted, hidden, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = ${playlist_id} AND pd.user_id = ${user_id} ORDER BY pd.playlist_order`, (err, rows) => {
                                if (err) return res.sendStatus(400);
                                const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored }) => ({
                                    id: id,
                                    gsvn : gsvn,
                                    url: video_id,
                                    interface_link: interface_link,
                                    title: decodeString(video_title),
                                    description,
                                    type: video_type,
                                    author: video_author,
                                    thumb : thumbnail,
                                    tags : tags, 
                                    gotags : gotags, 
                                    category : category,
                                    author_img : author_img,
                                    authorLink : author_link,
                                    length: video_length,
                                    dotted: dotted,
                                    hidden: hidden,
                                    order: playlist_order,
                                    episode_title:episode_title,
                                    sponsored : sponsored
                                }))
                                res.send({ videos });
                            });
                        })
                    }
                })
            })
        })
    })
})

module.exports = router;
