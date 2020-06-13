const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.sendStatus(400);
        }  
        conn.query('SELECT user_id, GROUP_CONCAT(gridset_id) griset_ids FROM user_gridsets GROUP BY user_id', (err, rows) => {
            if (err) return res.sendStatus(400);
            const gridsets = rows.map(({ user_id, griset_ids, ...rest }) => {
                const gridset_id = griset_ids ? griset_ids.split(',').map(id => +id) : [];
                return {
                    ...rest,
                    user_id,
                    gridset_id
                }
            });
            res.send({
                gridsets
            });
        });
    });
})

router.post('/', (req, res) => {
    
    const { id } = req.body;
   
    req.getConnection((err, conn) => {
        if (err) {
            return res.sendStatus(400);
        }
        conn.query(`SELECT gridset_id, gridsets.name, gridsets.description , sort_id, pd.pwd_protected, pd.locked FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${id}  ORDER BY pd.sort_id`, (err, rows) => {
            if (err) {
                return res.sendStatus(400);
            }
            res.send({
                gridsets : rows,
            })
        });
    });
  
})

router.post('/move-gridset', (req, res) => {
    const { id, old, order } = req.body;
    req.getConnection((err, conn) => {
        if (err) return res.sendStatus(400);
            conn.query(`
                    UPDATE user_gridsets SET sort_id = 
                    CASE
                    WHEN sort_id = ${old} THEN ${order}
                    WHEN sort_id = ${order} THEN ${old}
                    ELSE sort_id
                    END
                    WHERE user_id = ${id}
                `, (err) => {
                    if (err) return res.sendStatus(400);
                    conn.query(`SELECT user_id, gridset_id, gridsets.name, gridsets.description , sort_id, pd.pwd_protected, pd.locked FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${id}  ORDER BY pd.sort_id`, (err, rows) => {
                        if (err) {
                            return res.sendStatus(400);
                        }
                        res.send({
                            gridsets: rows
                        });
                    });
                })
    })
})

router.post('/add-gridset', (req, res) => {
    const { user, gridset } = req.body;
    req.getConnection((err, conn) => {
        if (err) return res.sendStatus(400);
        conn.query(`SELECT  gridset_id  FROM user_gridsets WHERE user_id = ${user} AND gridset_id = ${gridset}`, (err, rows) => {
            if (err) return res.sendStatus(400);
            if(rows.length > 0) 
            {
                res.send({
                    gridsets: false
                });
            }
            else{
                conn.query(`SELECT pwd_protected FROM gridsets WHERE id = ${gridset}`, (err, rows) => {
                    if (err) return res.sendStatus(400);
                    const pwd_protected = rows[0].pwd_protected;
                    conn.query(`SELECT  sort_id FROM user_gridsets WHERE user_id = ${user}`, (err, rows) => {
                        if (err) return res.sendStatus(400);
                        const orders = rows.map(({sort_id}) => {
                            return sort_id;
                        })
                        getTheLastOrder(orders, (last_order) => {
                            const data = [user, gridset, last_order, pwd_protected, 1];
                            conn.query('INSERT INTO user_gridsets(user_id, gridset_id, sort_id, pwd_protected, locked) VALUES (?)', [data], (err) => {
                                if (err) return res.sendStatus(400);
                                conn.query(`SELECT * FROM gridset_data WHERE gridset_id = ${gridset}`, (err, rows) => {
                                    if (err) return res.sendStatus(400);
                                    if(rows.length === 0) {
                                        conn.query(`SELECT gridset_id, gridsets.name, gridsets.description , sort_id, pd.pwd_protected, pd.locked FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${user}  ORDER BY pd.sort_id`, (err, rows) => {
                                            if (err) {
                                                return res.sendStatus(400);
                                            }
                                            res.send({
                                                gridsets : rows,
                                            })
                                        });
                                    }
                                    else {
                                        const user_playlists = rows.map(({playlist_id, playlist_order}) => {
                                            return [user, gridset, playlist_id, playlist_order];
                                        })
                                        conn.query(`SELECT playlist_id FROM user_playlists WHERE user_id=${user}`, (err, rows) => {
                                            if (err) return res.sendStatus(400);
                                            const all_playlist_id = rows.map(({playlist_id}) => {
                                                return playlist_id;
                                            })
                                            removeDuplicatedPlaylist(all_playlist_id, (all_playlist_id)=>{
                                                conn.query('INSERT INTO user_playlists(user_id, gridset_id, playlist_id, playlist_order) VALUES ?', [user_playlists], (err) => {
                                                    if (err) return res.sendStatus(400);
                                                    const unique_playlist = user_playlists.map((user_playlist) => {
                                                        return user_playlist[2]
                                                    })
                                                    getRemovePlaylist(all_playlist_id, unique_playlist, (unique_playlist)=> {
                                                        if(unique_playlist.length === 0) {
                                                            conn.query(`SELECT gridset_id, gridsets.name, gridsets.description , sort_id, pd.pwd_protected, pd.locked FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${user}  ORDER BY pd.sort_id`, (err, rows) => {
                                                                if (err) {
                                                                    return res.sendStatus(400);
                                                                }
                                                                res.send({
                                                                    gridsets : rows,
                                                                })
                                                            });
                                                        }
                                                        else {
                                                            conn.query(`SELECT * FROM playlist_data WHERE ${unique_playlist.map((unique_playlist) => `playlist_id="${unique_playlist}"`).join(' OR ')} ORDER BY playlist_order`, (err, rows) => {
                                                                if (err) return res.sendStatus(400);
                                                                if(rows.length === 0) {
                                                                    conn.query(`SELECT gridset_id, gridsets.name, gridsets.description , sort_id, pd.pwd_protected, pd.locked FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${user}  ORDER BY pd.sort_id`, (err, rows) => {
                                                                        if (err) {
                                                                            return res.sendStatus(400);
                                                                        }
                                                                        res.send({
                                                                            gridsets : rows,
                                                                        })
                                                                    });
                                                                }
                                                                else {
                                                                    const user_info = rows.map(({playlist_id, playlist_order, video_id}) => {
                                                                        return [user, playlist_id, video_id, playlist_order, 0, 0];
                                                                    })
                                                                    conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order, hidden, dotted) VALUES ?', [user_info], (err) => {
                                                                        if (err) return res.sendStatus(400);
                                                                        conn.query(`SELECT gridset_id, gridsets.name, gridsets.description , sort_id, pd.pwd_protected, pd.locked FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${user}  ORDER BY pd.sort_id`, (err, rows) => {
                                                                            if (err) {
                                                                                return res.sendStatus(400);
                                                                            }
                                                                            res.send({
                                                                                gridsets : rows,
                                                                            })
                                                                        });
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                })
                                            })
                                        })
                                    }
                                })
                            })
                        })
                    })    
                })
                
            }
        
        })    
    })
})

router.post('/remove-gridset', (req, res) => { 
    const { user, gridset, order} = req.body;
    req.getConnection((err, conn) => {
        if (err) return res.sendStatus(400);
        conn.query(`DELETE FROM user_gridsets WHERE user_id=${user} AND gridset_id=${gridset}`, (err) => {
            if (err) return res.sendStatus(400);
            conn.query(`UPDATE user_gridsets SET sort_id = sort_id - 1 WHERE sort_id > ${order}`, (err) => {
                if (err) return res.sendStatus(400);
                conn.query(`SELECT playlist_id FROM user_playlists WHERE user_id=${user} AND gridset_id=${gridset}`, (err, rows) => {
                    if (err) return res.sendStatus(400);
                    if(rows.length === 0) {
                        conn.query(`SELECT user_id, gridset_id,  gridsets.name, gridsets.description , sort_id, pd.pwd_protected, pd.locked FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${user}  ORDER BY pd.sort_id`, (err, rows) => {
                            if (err) {
                                return res.sendStatus(400);
                            }
                            res.send({
                                gridsets: rows
                            });
                        });
                    }
                    else {
                        const remove_playlist_id = rows.map(({playlist_id}) => {
                            return playlist_id;
                        })
                        conn.query(`DELETE FROM user_playlists WHERE user_id=${user} AND gridset_id=${gridset}`, (err, rows) => {
                            if (err) return res.sendStatus(400);
                            conn.query(`SELECT playlist_id FROM user_playlists WHERE user_id=${user}`, (err, rows) => {
                                if (err) return res.sendStatus(400);
                                const all_playlist_id = rows.map(({playlist_id}) => {
                                    return playlist_id;
                                })
                                removeDuplicatedPlaylist(all_playlist_id, (all_playlist_id)=>{
                                    getRemovePlaylist(all_playlist_id, remove_playlist_id, (remove_playlist_id)=> {
                                        if(remove_playlist_id.length === 0) {
                                            conn.query(`SELECT user_id, gridset_id,  gridsets.name, gridsets.description , sort_id, pd.pwd_protected, pd.locked FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${user}  ORDER BY pd.sort_id`, (err, rows) => {
                                                if (err) {
                                                    return res.sendStatus(400);
                                                }
                                                res.send({
                                                    gridsets: rows
                                                });
                                            });
                                        }
                                        else {
                                            conn.query(`DELETE FROM user_info WHERE user_id=${user} AND (${remove_playlist_id.map((remove_playlist_id) => `playlist_id="${remove_playlist_id}"`).join(' OR ')})`, (err) => {
                                                if (err) return res.sendStatus(400);
                                                conn.query(`SELECT user_id, gridset_id,  gridsets.name, gridsets.description , sort_id, pd.pwd_protected, pd.locked FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${user}  ORDER BY pd.sort_id`, (err, rows) => {
                                                    if (err) {
                                                        return res.sendStatus(400);
                                                    }
                                                    res.send({
                                                        gridsets: rows
                                                    });
                                                });
                                            })
                                        }
                                    })
                                })
                            })
                        })
                    }
                })
            })
        })
    })
})

router.post('/resetAllGridsets', (req, res) => {
    const { user_id, gridset_id } = req.body;
    req.getConnection((err, conn) => {
        if (err) return res.sendStatus(400);
        conn.query(`SELECT playlist_id FROM user_playlists WHERE user_id=${user_id} AND gridset_id=${gridset_id}`, (err, rows) => {
            if (err) { console.log(err); return res.sendStatus(400);}
            const remove_playlist_id = rows.map(({playlist_id}) => {
                return playlist_id;
            })
            conn.query(`DELETE FROM user_playlists WHERE user_id=${user_id} AND gridset_id=${gridset_id}`, (err) => {
                if (err) { console.log(err); return res.sendStatus(400);}
                conn.query(`SELECT playlist_id FROM user_playlists WHERE user_id=${user_id}`, (err, rows) => {
                    if (err) { console.log(err); return res.sendStatus(400);}
                    const all_playlist_id = rows.map(({playlist_id}) => {
                        return playlist_id;
                    })
                    removeDuplicatedPlaylist(all_playlist_id, (all_playlist_id)=>{
                        getRemovePlaylist(all_playlist_id, remove_playlist_id, (remove_playlist_id)=> {
                            console.log(`DELETE FROM user_info WHERE user_id=${user_id} AND IF(${remove_playlist_id.length } = 0, '0', (${remove_playlist_id.map((remove_playlist_id) => `playlist_id='${remove_playlist_id}'`).join(' OR ')}))`);
                            conn.query(`DELETE FROM user_info WHERE user_id=${user_id} AND IF(${remove_playlist_id.length } = 0, '0', (${remove_playlist_id.map((remove_playlist_id) => `playlist_id='${remove_playlist_id}'`).join(' OR ')}))`, (err) => {
                                if (err) { console.log(err); return res.sendStatus(400);}
                                conn.query(`SELECT playlist_id, playlist_order FROM gridset_data WHERE gridset_id = ${gridset_id}`, (err, rows) => {
                                    if (err) { console.log(err); return res.sendStatus(400);}
                                    if(rows.length === 0) {
                                        res.send({
                                            success : true,
                                        })
                                    }
                                    else {
                                        const user_playlists = rows.map(({playlist_id, playlist_order}) => {
                                            return [user_id, gridset_id, playlist_id, playlist_order];
                                        })
                                        conn.query('INSERT INTO user_playlists(user_id, gridset_id, playlist_id, playlist_order) VALUES ?', [user_playlists], (err) => {
                                            if (err) { console.log(err); return res.sendStatus(400);}
                                            const unique_playlist = user_playlists.map((user_playlist) => {
                                                return user_playlist[2]
                                            })
                                            getRemovePlaylist(all_playlist_id, unique_playlist, (unique_playlist)=> {
                                                if(unique_playlist.length === 0) {
                                                    res.send({
                                                        success : true,
                                                    })
                                                }
                                                else {
                                                    conn.query(`SELECT * FROM playlist_data WHERE ${unique_playlist.map((unique_playlist) => `playlist_id="${unique_playlist}"`).join(' OR ')} ORDER BY playlist_order`, (err, rows) => {
                                                        if (err) { console.log(err); return res.sendStatus(400);}
                                                        if(rows.length === 0) {
                                                            res.send({
                                                                success : true,
                                                            })
                                                        }
                                                        else {
                                                            const user_info = rows.map(({playlist_id, playlist_order, video_id}) => {
                                                                return [user_id, playlist_id, video_id, playlist_order, 0, 0];
                                                            })
                                                            conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order, hidden, dotted) VALUES ?', [user_info], (err) => {
                                                                if (err) { console.log(err); return res.sendStatus(400);}
                                                                res.send({
                                                                    success : true,
                                                                })
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        })
                                    }
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})

router.post('/updateLocked', (req, res) => {
    
    const { user_id, gridset_id, locked } = req.body;
   
    req.getConnection((err, conn) => {
        if (err) {
            return res.sendStatus(400);
        }
        conn.query(`UPDATE user_gridsets SET locked = ${locked} WHERE user_id=${user_id} AND gridset_id = ${gridset_id}`, (err) => {
            if (err) {
                return res.sendStatus(400);
            }
            res.send({
                success : true
            })
        });
    });
  
})

router.post('/remove-playlist', (req, res) => { 
  const { user_id, gridset_id, gspn } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.sendStatus(400);
    conn.query("SELECT id FROM playlists WHERE gspn = ?", gspn, (err, rows) =>{
      if(err) return res.sendStatus(400);
      const playlist_id = rows[0]['id'];
      conn.query(`SELECT playlist_order FROM user_playlists WHERE user_id = ${user_id} AND gridset_id = ${gridset_id} AND playlist_id = ${playlist_id}`, (err, rows) => {
        if(err) return res.sendStatus(400);
        const playlist_order = rows[0]['playlist_order'];
        conn.query(`DELETE FROM user_playlists WHERE user_id = ${user_id} AND gridset_id = ${gridset_id} AND playlist_id = ${playlist_id}`, (err) => {
          if(err) { console.log(err); return res.sendStatus(400);}
          conn.query(`
                    UPDATE user_playlists SET playlist_order = 
                    CASE
                    WHEN playlist_order > ${playlist_order} THEN playlist_order - 1
                    ELSE playlist_order
                    END
                    WHERE user_id = ${user_id} AND gridset_id = ${gridset_id}
                `, (err) => {
                    if(err) { console.log(err); return res.sendStatus(400);}
                    conn.query(`SELECT * FROM user_playlists WHERE user_id = ${user_id} AND playlist_id = ${playlist_id}`, (err, rows) => {
                        if(err) { console.log(err); return res.sendStatus(400);}
                      if(rows.length === 0) {
                        conn.query(`DELETE FROM user_info WHERE user_id = ${user_id} AND playlist_id = ${playlist_id}`, (err) => {
                            if(err) { console.log(err); return res.sendStatus(400);}
                          res.send({
                            success : true,
                          })
                        })
                      }
                      else {
                        res.send({
                          success : true,
                        })
                      }
                    })
                })
        })
      })
    })
  })
})
router.post('/setGridsetAsMaster', (req, res) => {
    
    const { user_id, gridset_id } = req.body;
   
    req.getConnection((err, conn) => {
        if (err) {
            return res.sendStatus(400);
        }
        conn.query(`SELECT playlist_id, playlist_order FROM user_playlists WHERE user_id = ${user_id} AND gridset_id = ${gridset_id}`, (err, rows) => {
            if(err) return res.sendStatus(400);
            if(rows.length === 0) {
                res.send({
                    success : false,
                })
            }
            else {
                const gridset_data = rows.map(({playlist_id, playlist_order}) => {
                    return [gridset_id,playlist_id, playlist_order];
                })
                conn.query(`DELETE FROM gridset_data WHERE gridset_id = ${gridset_id}`, (err) => {
                    if(err) return res.sendStatus(400);
                    conn.query(`INSERT INTO gridset_data(gridset_id, playlist_id, playlist_order) VALUES ?`, [gridset_data], (err) => {
                        if(err) return res.sendStatus(400);
                        conn.query(`SELECT playlist_id, video_id, playlist_order FROM user_info WHERE (${gridset_data.map(gridset => `playlist_id = '${gridset[1]}'`).join(' OR ')}) AND user_id = ${user_id}`, (err, rows) => {
                            if(err) return res.sendStatus(400);
                            if(rows.length === 0) {
                                res.send({
                                    success : true
                                })
                            }
                            else {
                                const playlist_data = rows.map(({playlist_id, playlist_order, video_id}) => {
                                    return [playlist_id, playlist_order, video_id];
                                })
                                conn.query(`DELETE FROM playlist_data WHERE ${gridset_data.map(gridset => `playlist_id = '${gridset[1]}'`).join(' OR ')}`, (err) => {
                                    if(err) return res.sendStatus(400);
                                    conn.query(`INSERT INTO playlist_data(playlist_id, playlist_order, video_id) VALUES ?`, [playlist_data], (err) => {
                                        if(err) return res.sendStatus(400);
                                        res.send({
                                            success : true
                                        })
                                    })
                                })
                            }
                        })
                    })
                })
            }
        })
    });
  
})

const removeDuplicatedPlaylist = (all_playlist_id, callback) => {
    all_playlist_id = new Set(all_playlist_id);
    all_playlist_id = [...all_playlist_id];
    callback(all_playlist_id);
}

const getRemovePlaylist = (all_playlist_id, remove_playlist_id, callback) =>{
    remove_playlist_id = remove_playlist_id.filter(val => !all_playlist_id.includes(val));
    callback(remove_playlist_id);
}

const getTheLastOrder = (orders, callback) => {
    let last_order = 0;
    if(orders.length === 0 ) {
        callback(last_order);
    }
    else {
        var _ = require('lodash');
        var order = _.max(orders);
        last_order = order + 1;
        callback(last_order);
    }
}

module.exports = router;