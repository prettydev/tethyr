const express = require('express');
const router = express.Router();

router.get('/getAllGridset/:userId', (req, res) => {
  const { userId } = req.params;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`SELECT gridsets.*, pd.locked, pd.ganged_gridset, pd.sort_id FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${userId} AND pd.status = 1  ORDER BY pd.sort_id`, (err, rows) => {
      if (err) {
        return res.sendStatus(400);
      }
      res.send({
        gridsets: rows
      });
    });
  });
})

router.get('/getUserGridset/:userId/:per_page/:page', (req, res) => {
  const { userId, per_page, page } = req.params;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    if(per_page === 'all') {
      conn.query(`SELECT gridsets.*, pd.locked, pd.ganged_gridset, pd.sort_id, pd.status FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${userId}  ORDER BY pd.sort_id`, (err, rows) => {
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
                    conn.query(`SELECT gridsets.*, pd.locked, pd.ganged_gridset, pd.sort_id, pd.status FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${userId}  ORDER BY pd.sort_id LIMIT ${per_page * (page - 1)}, ${per_page}`, (err, rows) => {
                      if (err) {
                        return res.sendStatus(400);
                      }
                      else if(total !== 0 && rows.length === 0) {
                        conn.query(`SELECT gridsets.*, pd.locked, pd.ganged_gridset, pd.sort_id, pd.status FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${userId}  ORDER BY pd.sort_id LIMIT ${per_page * (page - 2)}, ${per_page}`, (err, rows) => {
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
})

router.get('/getPublicGridset/:userId/:per_page/:page', (req, res) => {
  const { userId, per_page, page } = req.params;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`SELECT COUNT (*)
                  FROM
                    (SELECT * FROM gridsets WHERE visibility = 0) t1
                  LEFT JOIN
                    (SELECT gridset_id AS exist FROM user_gridsets WHERE user_id = '${userId}') t2
                  ON (t1.id = t2.exist)`, (err, rows) => {
                    if (err) {
                      return res.sendStatus(400);
                    }
                    const total = rows[0]['COUNT (*)'];
                    const total_pages = Math.ceil( total / per_page );
                    conn.query(`SELECT *
                                  FROM
                                    (SELECT * FROM gridsets WHERE visibility = 0) t1
                                  LEFT JOIN
                                    (SELECT gridset_id AS exist FROM user_gridsets WHERE user_id = '${userId}') t2
                                  ON (t1.id = t2.exist) LIMIT ${per_page * (page - 1)}, ${per_page}`, (err, rows) => {
                      if (err) {
                        return res.sendStatus(400);
                      }
                      res.send({
                        data : rows,
                        page,
                        per_page,
                        total,
                        total_pages
                      })
                    });
                  })
  });
})

router.post('/takePublicGridset/:userId', (req, res) => {
  const { userId } = req.params;
  const { gridset_id } = req.body;
  req.getConnection((err, conn) => {
    if (err) { return res.sendStatus(400); }
    conn.query(`SELECT COUNT (*) FROM user_gridsets WHERE user_id = ${userId}`, (err, rows) => {
      if (err) { return res.sendStatus(400); }
      const order = rows[0]['COUNT (*)'];
      conn.query('INSERT INTO user_gridsets(user_id, gridset_id, sort_id) VALUES(?,?,?)', [userId, gridset_id, order], (err) => {
        if (err) { return res.sendStatus(400); }
        conn.query(`SELECT * FROM gridset_data WHERE gridset_id = ${gridset_id}`, (err, rows) => {
          if (err) { return res.sendStatus(400); }
          if(rows.length === 0) {
            res.send({
              success : true,
            })
          }
          else {
            const gridsets = rows.map(({gridset_id, playlist_id, playlist_order}) => {
              return [userId, gridset_id, playlist_id, playlist_order];
            })
            conn.query('INSERT INTO user_playlists(user_id, gridset_id, playlist_id, playlist_order) VALUES ?', [gridsets], (err) => {
              if (err) { return res.sendStatus(400); }
              conn.query(`SELECT *
                            FROM
                              (SELECT playlist_id FROM gridset_data WHERE gridset_id = '${gridset_id}') t1
                            LEFT JOIN
                              (SELECT DISTINCT playlist_id AS playlist FROM user_info WHERE user_id = '${userId}') t2
                            ON (t1.playlist_id = t2.playlist) WHERE t2.playlist IS NULL`, (err, rows) => {
                              if (err) { return res.sendStatus(400); }
                              if(rows.length === 0) {
                                res.send({
                                  success : true,
                                })
                              }
                              else {
                                const playlists = rows.map(({playlist_id}) => {
                                  return playlist_id;
                                })
                                conn.query(`SELECT * FROM playlist_data WHERE playlist_id IN (${playlists.map(playlist => playlist).join(', ')})`, (err, rows) => {
                                  if (err) { return res.sendStatus(400); }
                                  if(rows.length === 0) {
                                    res.send({
                                      success : true,
                                    })
                                  }
                                  else {
                                    const user_info = rows.map(({playlist_id, playlist_order, video_id}) => {
                                      return [userId, playlist_id, video_id, playlist_order];
                                    })
                                    conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order) VALUES ?', [user_info], (err) => {
                                      if (err) { return res.sendStatus(400); }
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
    });
  });
})

router.post('/gangedGridset/:userId', (req, res) => {
  const { userId } = req.params;
  const { gridset_id, playlist_id, value } = req.body;
  console.log(gridset_id, playlist_id, value)
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`SELECT ganged_gridset FROM user_gridsets WHERE user_id = ${userId} AND gridset_id = ${gridset_id}`, (err, rows) => {
      if (err) {
        return res.sendStatus(400);
      }
      const ganged_gridset = rows[0]['ganged_gridset'];
      if(ganged_gridset === 0) {
        conn.query(`SELECT playlist_id FROM user_playlists WHERE user_id = ${userId} AND gridset_id = ${gridset_id}`, (err, rows) => {
          if (err) {
            return res.sendStatus(400);
          }
          const playlists = rows.map(({playlist_id}) => {
            return playlist_id;
          })
          conn.query(`SELECT playlist_id FROM user_info WHERE ${playlists.map(playlist => `(user_id = ${userId} AND playlist_id = '${playlist}')`).join(' OR ')}`, (err, rows) => {
            if (err) {
              return res.sendStatus(400);
            }
            const playlist_id_lists = rows.map(({playlist_id}) => {
              return playlist_id;
            })
            checkGanged(playlists, playlist_id_lists, (flag) => {
              if(flag) {
                conn.query(`UPDATE user_gridsets SET ganged_gridset = 1 WHERE user_id = ${userId} AND gridset_id = ${gridset_id}`, (err) => {
                  if (err) {
                    return res.sendStatus(400);
                  }
                  conn.query(`UPDATE user_playlists SET playlist_ganged = 1 WHERE user_id = ${userId} AND gridset_id = ${gridset_id} AND playlist_id = ${playlist_id}`, (err) => {
                    if (err) {
                      return res.sendStatus(400);
                    }
                    conn.query(`UPDATE user_playlists SET playlist_auto_update = 0 WHERE user_id = ${userId} AND gridset_id = ${gridset_id}`, (err) => {
                      if (err) {
                        return res.sendStatus(400);
                      }
                      res.send({
                        success : true
                      })
                    })
                  })
                })
              }
              else {
                res.send({
                  success : flag
                })
              }
            })
          })
        })
      }
      else {
        if(value === 0) {
          conn.query(`UPDATE user_playlists SET playlist_ganged = 
                        CASE
                          WHEN playlist_id = ${playlist_id} THEN 1
                          ELSE 0
                        END
                        WHERE user_id = ${userId} AND gridset_id = ${gridset_id}`, (err) => {
                          if (err) {
                            return res.sendStatus(400);
                          }
                          res.send({
                            success : true
                          })
                        })
        }
        else {
          conn.query(`UPDATE user_gridsets SET ganged_gridset = 0 WHERE user_id = ${userId} AND gridset_id = ${gridset_id}`, (err) => {
            if (err) {
              return res.sendStatus(400);
            }
            conn.query(`UPDATE user_playlists SET playlist_ganged = 0 WHERE user_id = ${userId} AND gridset_id = ${gridset_id} AND playlist_id = ${playlist_id}`, (err) => {
              if (err) {
                return res.sendStatus(400);
              }
              res.send({
                success : true
              })
            })
          })
        }
      }
    })
  });
})

router.post('/setUserGridsetStatus/:userId', (req, res) => {
  const { gridset_id, status } = req.body;
  const { userId } = req.params;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`UPDATE user_gridsets SET status = '${status}' WHERE user_id = ${userId} AND gridset_id = ${gridset_id}`, (err) => {
      if (err) {
        return res.sendStatus(400);
      }
      res.send({
        success : true,
      })
    })
  });
})

router.post('/editUserGridset/:userId', (req, res) => {
  const { gridset_id, title, description } = req.body;
  const { userId } = req.params;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`SELECT * FROM gridsets WHERE name = '${title}'`, (err, rows) => {
      if (err) {
        return res.sendStatus(400);
      }
      else if(rows.length > 0){
        res.send({
          success : false,
        })
      }
      else {
        conn.query(`UPDATE gridsets SET name = '${title}', description = '${description}' WHERE id = '${gridset_id}'`, (err) => {
          if (err) {
            return res.sendStatus(400);
          }
          res.send({
            success : true,
          })
        })
      }
    })
  });
})

router.post('/saveUserGridsetOrders/:userId', (req, res) => {
  const { items } = req.body;
  const { userId } = req.params;
  const data = items.map(({id, pwd_protected, locked, ganged_gridset, status }, index) => {
    return [userId, id, index, pwd_protected, locked, ganged_gridset, status ];
  })
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`DELETE FROM user_gridsets WHERE user_id = '${userId}'`, (err) => {
      if (err) {
        return res.sendStatus(400);
      }
      conn.query('INSERT INTO user_gridsets(user_id, gridset_id, sort_id, pwd_protected, locked, ganged_gridset, status) VALUES ?', [data], (err) => {
        if (err) {
          return res.sendStatus(400);
        }
        res.send({
          success: true,
        })
      })
    })
  });
})

router.post('/setGridsetAsMaster/:userId', (req, res) => {
  const { gridset_id } = req.body;
  const { userId } = req.params;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`SELECT playlist_id, playlist_order FROM user_playlists WHERE user_id = ${userId} AND gridset_id = ${gridset_id}`, (err, rows) => {
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
            conn.query(`SELECT playlist_id, video_id, playlist_order FROM user_info WHERE (${gridset_data.map(gridset => `playlist_id = '${gridset[1]}'`).join(' OR ')}) AND user_id = ${userId}`, (err, rows) => {
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

router.post('/createUserGridset/:userId', (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.params;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`SELECT * FROM gridsets WHERE name = '${title}' AND owner = '${userId}'`, (err, rows) => {
      if (err) {
        return res.sendStatus(400);
      }
      else if(rows.length > 0){
        res.send({
          success : false,
        })
      }
      else {
        conn.query(`INSERT INTO gridsets(name, description, visibility, owner) VALUES(?,?,?, ?)`, [title, description, 1, userId], (err, rows) => {
          if (err) {
            return res.sendStatus(400);
          }
          const gridset_id = rows.insertId;
          conn.query(`SELECT COUNT (*) FROM user_gridsets WHERE user_id = '${userId}'`, (err, rows) => {
            if (err) {
              return res.sendStatus(400);
            }
            const sort_id = rows[0]['COUNT (*)'];
            conn.query(`INSERT INTO user_gridsets(user_id, gridset_id, sort_id) VALUES(?,?,?)`, [userId, gridset_id, sort_id], (err) => {
              if (err) {
                return res.sendStatus(400);
              }
              res.send({
                success : true,
              })
            })
          })
        })
      }
    })
  });
})

router.post('/setUserGridsetPermission/:userId', (req, res) => {
  const { gridset_id } = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`SELECT visibility FROM gridsets WHERE id = '${gridset_id}'`, (err, rows) => {
      if (err) {
        return res.sendStatus(400);
      }
      const permission = rows[0]['visibility'];
      conn.query(`UPDATE gridsets SET visibility =
                        CASE
                          WHEN ${permission} = 1 THEN 0
                          ELSE 1
                        END
                        WHERE id = '${gridset_id}'`, (err) => {
                          if (err) {
                            return res.sendStatus(400);
                          }
                          res.send({
                            success : true
                          })
                        })
    })
  });
})

const checkGanged = (playlists, playlist_id_lists, callback) => {
  var _ = require('lodash');
  const playlist_list = _.uniqBy(playlist_id_lists);
  if(_.isEqual(_.sortBy(playlists), _.sortBy(playlist_list))) {
    const counts = _.countBy(playlist_id_lists);
    const values = Object.values(counts)
    const unique_list = _.uniqBy(values);
    if(unique_list.length === 1) callback(true);
    else callback(false)
  }
  else {
    callback(false);
  }
}

module.exports = router;
