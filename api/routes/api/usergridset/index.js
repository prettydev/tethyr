const express = require('express');
const router = express.Router();
const checkToken = require('../../../helpers/checkToken');
const {
  getUserPublicGridsets,
  getUserPlaylistsByGridsetId,
} = require('../models/userGridset')
const {
  removePlaylistsByGridsetId,
  addPlaylistsToGridset
} = require('../models/gridset')

router.get('/', (req, res) => {
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
    //     }
    //     else {
    //         res.send({ status: 401, message: 'Unauthorized request!'});
    //     }
    // });
})

router.post('/', (req, res) => {
    
    const { id } = req.body;
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
                    return res.sendStatus(400);
                }
                conn.query(`SELECT user_id, gridset_id, gridsets.name, gridsets.description , sort_id FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${id}  ORDER BY pd.sort_id`, (err, rows) => {
                    if (err) {
                        return res.sendStatus(400);
                    }
                    res.send({
                        gridsets: rows
                    });
                });
            });
    //     }
    //     else {
    //         res.send({ status: 401, message: 'Unauthorized request!'});
    //     }
    // });
})

router.get('/getAllGridset/:user_id', (req, res) => {
  const { user_id } = req.params;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`SELECT gridsets.*, pd.locked, pd.ganged_gridset, pd.gridset_order FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND pd.user_id = '${user_id}' AND pd.status = 1 ORDER BY pd.gridset_order`, (err, rows) => {
      if (err) {
        return res.sendStatus(400);
      }
      res.send({
        gridsets: rows
      });
    });
  });
})

router.get('/getUserPublicGridsets/:user_id', (req, res) => {
  const { user_id } = req.params;
  const email = checkToken(req);
  if(email) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(400).send({ message: 'Database Connection Failed!'});
      }
      getUserPublicGridsets(conn, user_id)
      .then((gridsets) => {
        res.send({
          gridsets
        });
      })
      .catch(err => {
        res.status(err.status).send(err.message)
      })
    });
  }
  else {
    res.status(401).send({message: 'Unauthorized request!'});
  }
})

router.get('/getUserAllGridset/:userId/:per_page/:page', (req, res) => {
  const { userId, per_page, page } = req.params;
  const email = checkToken(req);
  if(email) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.sendStatus(400);
      }
      if(per_page === 'all') {
        conn.query( `SELECT gridsets.*, pd.locked, pd.ganged_gridset, pd.sort_id, pd.status, pd.shared_id, pd.shared_status FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = '${userId}'  ORDER BY pd.sort_id`, (err, rows) => {
          if (err) {
            return res.sendStatus(400);
          }
          res.send({
            data : rows,
          })
        })
      }
      else {
        conn.query(`SELECT COUNT (*) FROM user_gridsets WHERE user_id = '${userId}'`, (err, rows) => {
                      if (err) {
                        return res.sendStatus(400);
                      }
                      const total = rows[0]['COUNT (*)'];
                      const total_pages = Math.ceil( total / per_page );
                      conn.query(`SELECT gridsets.*, pd.locked, pd.ganged_gridset, pd.sort_id, pd.status, pd.shared_id, pd.shared_status FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = '${userId}'  ORDER BY pd.sort_id LIMIT ${per_page * (page - 1)}, ${per_page}`, (err, rows) => {
                        if (err) {
                          return res.sendStatus(400);
                        }
                        else if(total !== 0 && rows.length === 0) {
                          conn.query(`SELECT gridsets.*, pd.locked, pd.ganged_gridset, pd.sort_id, pd.status, pd.shared_id, pd.shared_status FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = '${userId}'  ORDER BY pd.sort_id LIMIT ${per_page * (page - 2)}, ${per_page}`, (err, rows) => {
                            if (err) {
                              return res.sendStatus(400);
                            }
                            res.send({
                              data : rows,
                              page : page -1,
                              per_page,
                              total,
                              total_pages
                            })
                          })
                        }
                        else {
                          res.send({
                            data : rows,
                            page,
                            per_page,
                            total,
                            total_pages
                          })
                        }
                      });
                    })
      }
    });
  }
  else {
    res.status(401).send({message: 'Unauthorized request!'});
  }
})

router.post('/getUserGridsetSharedLink', (req, res) => {
  const email = checkToken(req);
  const { user_id, gridset_id } = req.body;
  if(email) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(400).send({ message: 'Database Connection Failed!'});
      }
      conn.query(`SELECT shared_status FROM user_gridsets WHERE user_id = '${user_id}' AND gridset_id = '${gridset_id}'`, (err, rows) => {
        if (err) {
          return res.status(400).send({ message: 'Database Connection Failed!'});
        }
        if(rows[0]['shared_status'] === 1) {
          conn.query(`UPDATE user_gridsets SET shared_id = null, shared_date = null, shared_status = false WHERE user_id = '${user_id}' AND gridset_id = '${gridset_id}'`, (err) => {
            if (err) {
              return res.status(400).send({ message: 'Database Connection Failed!'});
            }
            res.send({
              success: true,
            })
          })
        }
        else {
          const random = Math.random().toString(36).slice(2);
          const shared_id = user_id.toString(16) + gridset_id.toString(16) + random;
          conn.query(`UPDATE user_gridsets SET shared_id = '${shared_id}', shared_date = NOW(), shared_status = true WHERE user_id = '${user_id}' AND gridset_id = '${gridset_id}'`, (err) => {
            if (err) {
              return res.status(400).send({ message: 'Database Connection Failed!'});
            }
            res.send({
              success: true,
            })
          })
        }
      })
    })
  }
  else {
    res.status(401).send({message: 'Unauthorized request!'});
  }
})

router.post('/importFromSharedLink', (req, res) => {
  const email = checkToken(req);
  const { user_id, shared_gridset_id } = req.body;
  if(email) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(400).send({ message: 'Database Connection Failed!'});
      }
      conn.query(`SELECT user_id, gridset_id FROM user_gridsets WHERE shared_id = '${shared_gridset_id}'`, (err, rows) => {
        if (err) {
          return res.status(400).send({ message: 'Database Connection Failed!'});
        }
        if(rows.length === 0) {
          res.send({
            success: false,
          })
        }
        else {
          const shared_user = rows[0]['user_id'];
          const shared_group = rows[0]['gridset_id'];
          conn.query(`SELECT * FROM user_playlists WHERE user_id = '${shared_user}' AND gridset_id = '${shared_group}' ORDER BY playlist_order`, (err, rows) => {
            if (err) {
              return res.status(400).send({ message: 'Database Connection Failed!'});
            }
            const shared_playlists_data = rows.map(({playlist_id, playlist_order}) => {
              return [user_id, shared_group, playlist_id, playlist_order]
            })
            const shared_playlist_ids = rows.map(({playlist_id}) => {
              return playlist_id
            })
            conn.query(`SELECT * FROM user_info WHERE user_id = '${shared_user}' AND playlist_id IN (${shared_playlist_ids.map((playlist_id) => `${playlist_id}`).join(', ')}) ORDER BY playlist_id, playlist_order`, (err, rows) => {
              if (err) {
                return res.status(400).send({ message: 'Database Connection Failed!'});
              }
              const shared_video_data = rows.map(({playlist_id, video_id, playlist_order}) => {
                return [user_id, playlist_id, video_id, playlist_order]
              })
              conn.query(`DELETE FROM user_playlists WHERE user_id = '${user_id}' AND gridset_id = '${shared_group}'`, (err) => {
                if (err) {
                  return res.status(400).send({ message: 'Database Connection Failed!'});
                }
                conn.query(`DELETE FROM user_info WHERE user_id = '${user_id}' AND playlist_id IN (${shared_playlist_ids.map((playlist_id) => `${playlist_id}`).join(', ')})`, (err) => {
                  if (err) {
                    return res.status(400).send({ message: 'Database Connection Failed!'});
                  }
                  conn.query('INSERT INTO user_playlists(user_id, gridset_id, playlist_id, playlist_order) VALUES ?', [shared_playlists_data], (err) => {
                    if (err) {
                      return res.status(400).send({ message: 'Database Connection Failed!'});
                    }
                    conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order) VALUES ?', [shared_video_data], (err) => {
                      if (err) {
                        return res.status(400).send({ message: 'Database Connection Failed!'});
                      }
                      conn.query(`SELECT * FROM user_gridsets WHERE user_id = '${user_id}' AND gridset_id = '${shared_group}'`, (err, rows) => {
                        if (err) {
                          return res.status(400).send({ message: 'Database Connection Failed!'});
                        }
                        if(rows.length === 0) {
                          conn.query(`INSERT INTO user_gridsets(user_id, gridset_id, sort_id) VALUES(?, ?, ?)`, [user_id, shared_group, -1], (err) => {
                            if (err) {
                              return res.status(400).send({ message: 'Database Connection Failed!'});
                            }
                            conn.query(`UPDATE user_gridsets SET sort_id = sort_id + 1 WHERE user_id = '${user_id}'`, (err) => {
                              if (err) {
                                return res.status(400).send({ message: 'Database Connection Failed!'});
                              }
                              res.send({
                                success: true
                              })
                            })              
                          })
                        }
                        else {
                          const origin_sort_id = rows[0]['sort_id'];
                          conn.query(`UPDATE user_gridsets SET sort_id = -1 WHERE user_id = '${user_id}' AND gridset_id = '${shared_group}'`, (err) => {
                            if (err) {
                              return res.status(400).send({ message: 'Database Connection Failed!'});
                            }
                            conn.query(`UPDATE user_gridsets SET sort_id = 
                                        CASE
                                        WHEN sort_id < ${origin_sort_id} THEN sort_id + 1
                                        ELSE sort_id
                                        END
                                        WHERE user_id = '${user_id}'`, (err) => {
                              if (err) {
                                return res.status(400).send({ message: 'Database Connection Failed!'});
                              }
                              res.send({
                                success: true
                              })
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
        }
      })
    })
  }
  else {
    res.status(401).send({message: 'Unauthorized request!'});
  }
})

router.post('/setUserGridsetAsMaster', (req, res) => {
  const email = checkToken(req);
  const { user_id, gridset_id } = req.body;
  if(email) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(400).send({ message: 'Database Connection Failed!'});
      }
      getUserPlaylistsByGridsetId(conn, user_id, gridset_id)
      .then((playlists) => {
        if(playlists.length === 0) {
          res.send({
            success : false,
          })
        }
        else {
          const gridset_data = playlists.map(({playlist_id, playlist_order}) => {
            return [gridset_id,playlist_id, playlist_order];
          })
          removePlaylistsByGridsetId(conn, gridset_id)
          .then(() => {
            addPlaylistsToGridset(conn, gridset_data)
            .then(() => {
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
            .catch(err => {
              console.log(err)
              res.status(err.status).send(err.message)
            })
          })
          .catch(err => {
            res.status(err.status).send(err.message)
          })
        }
      })
      .catch(err => {
        res.status(err.status).send(err.message)
      })
    })
  }
  else {
    res.status(401).send({message: 'Unauthorized request!'});
  }
})

module.exports = router;