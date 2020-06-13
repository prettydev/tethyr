const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query('SELECT * FROM gridsets', (err, rows) => {
      if (err) {
        return res.sendStatus(400);
      }
      res.send({
        gridsets: rows
      });
    });
  });
})

router.get('/defaultGridset', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query('SELECT gr.id, gr.name, gr.description, gr.thumb, gr.visibility, pud.gridset_order FROM default_gridset pud LEFT JOIN (SELECT * FROM gridsets) gr ON gr.id = pud.gridset_id ORDER BY pud.gridset_order', (err, rows) => {
      if (err) {
        return res.sendStatus(400);
      }
      res.send({
        gridsets: rows
      });
    });
  });
})

router.post('/addDefaultGridset', (req, res) => {
  const {gridset} = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`SELECT * FROM default_gridset WHERE gridset_id = '${gridset}'`, (err, rows) => {
      if (err) {
        return res.sendStatus(400);
      }
      if(rows.length > 0) {
        res.send({
          success: false,
        })
      }
      else {
        conn.query('SELECT COUNT(*) FROM default_gridset', (err, rows) => {
          if (err) {
            console.log(err);
            return res.sendStatus(400);
          }
          const order = rows[0]['COUNT(*)'];
          conn.query('INSERT INTO default_gridset(gridset_id, gridset_order) VALUES(?, ?)', [gridset, order], (err) => {
            if (err) {
              console.log(err);
              return res.sendStatus(400); 
            }
            conn.query('SELECT gr.id, gr.name, gr.description, gr.thumb, gr.visibility, pud.gridset_order FROM default_gridset pud LEFT JOIN (SELECT * FROM gridsets) gr ON gr.id = pud.gridset_id ORDER BY pud.gridset_order', (err, rows) => {
              if (err) {
                console.log(err);
                return res.sendStatus(400);
              }
              res.send({
                success: true,
                gridsets: rows
              });
            });
          })
        })
      }
    })
  });
})

router.post('/removeDefaultGridset', (req, res) => {
  const {gridset} = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`SELECT gridset_order FROM default_gridset WHERE gridset_id = '${gridset}'`, (err, rows) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      const order = rows[0]['gridset_order'];
      conn.query(`DELETE FROM default_gridset WHERE gridset_id = '${gridset}'`, (err) => {
        if (err) {
          console.log(err);
          return res.sendStatus(400);
        }
        conn.query(`UPDATE default_gridset SET gridset_order = gridset_order - 1 WHERE gridset_order > '${order}'`, (err) => {
          if (err) {
            console.log(err);
            return res.sendStatus(400);
          }
          conn.query('SELECT gr.id, gr.name, gr.description, gr.thumb, gr.visibility, pud.gridset_order FROM default_gridset pud LEFT JOIN (SELECT * FROM gridsets) gr ON gr.id = pud.gridset_id ORDER BY pud.gridset_order', (err, rows) => {
            if (err) {
              console.log(err);
              return res.sendStatus(400);
            }
            res.send({
              success: true,
              gridsets: rows
            });
          });
        })
      })
    })
  });
})

router.post('/swapDefaultGrdisetOrder', (req, res) => {
  const {id, order, swap_id, swap_order} = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`UPDATE default_gridset SET gridset_order =
                  CASE
                    WHEN gridset_id = ${id} THEN ${swap_order}
                    WHEN gridset_id = ${swap_id} THEN ${order}
                    ELSE gridset_order
                  END`, (err) => {
      if (err) {
        return res.sendStatus(400);
      }
      conn.query('SELECT gr.id, gr.name, gr.description, gr.thumb, gr.visibility, pud.gridset_order FROM default_gridset pud LEFT JOIN (SELECT * FROM gridsets) gr ON gr.id = pud.gridset_id ORDER BY pud.gridset_order', (err, rows) => {
        if (err) {
          console.log(err);
          return res.sendStatus(400);
        }
        res.send({
          success: true,
          gridsets: rows
        });
      });
    })
  });
})

router.post('/new', (req, res) => {
  const { name, description, thumb, visibility, active } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.sendStatus(400);
    conn.query(`SELECT * FROM gridsets WHERE name = '${name}'`, (err, rows) => {
      if (err) return res.sendStatus(400);
      if(rows.length > 0) {
        res.send({
          success : false,
        })
      }
      else {
        conn.query('INSERT INTO gridsets(name, description, thumb, visibility, active) VALUES(?,?,?,?,?)',[name, description, thumb, visibility, active], (err, result) => {
          if (err) return res.sendStatus(400);
          const id = result.insertId;
          res.send({
            success: true,
            id
          });
        })
      }
    })
  })
})

router.get('/cube/:id', (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    conn.query(`SELECT pl.id, pl.gspn, pl.title, playlist_order FROM playlists pl LEFT JOIN (SELECT * FROM gridset_data) pud ON pl.id = pud.playlist_id WHERE gridset_id='${id}' AND active=1 ORDER BY pud.playlist_order`, (err, playlists) => {
      if (err) {
        return res.sendStatus(400);
      }
      res.send({
        playlists
      });
    })
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
      ...user
  } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.sendStatus(400);
    conn.query(`UPDATE gridsets SET ${Object.keys(user).map(field => `${field}='${user[field]}'`).join(',')} WHERE id=${id}`, (err) => {
      if (err) { console.log(err); return res.sendStatus(400);}
      res.send({
        success : true,
      })
    })
  })
})

router.post('/disable/:id', (req, res) => {
  const { id } = req.params;
  const { disable } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.sendStatus(400);
    conn.query(`UPDATE gridsets SET active = ${disable ? 0 : 1} WHERE id='${id}'`, (err) => {
      if (err) return res.sendStatus(400);
      res.send({ success: true });
    });
  })
})

router.post('/remove-gridset', (req, res) => {
  const { gridset_id } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.sendStatus(400);
    conn.query(`DELETE FROM gridsets WHERE id = ${gridset_id}`, (err) => {
      if (err) return res.sendStatus(400);
      conn.query(`DELETE FROM gridset_data WHERE gridset_id = ${gridset_id}`, (err) => {
        if (err) return res.sendStatus(400);
        conn.query(`DELETE FROM user_gridsets WHERE gridset_id = ${gridset_id}`, (err) => {
          if (err) return res.sendStatus(400);
          conn.query(`SELECT user_id, playlist_id FROM user_playlists WHERE gridset_id = ${gridset_id}`, (err, rows) => {
            if (err) return res.sendStatus(400);
            const remove_playlists = rows.map(({user_id, playlist_id}) => {
              return [user_id, playlist_id];
            })
            conn.query(`DELETE FROM user_playlists WHERE gridset_id = ${gridset_id}`, (err) => {
              if (err) return res.sendStatus(400);
              conn.query(`SELECT user_id, playlist_id FROM user_playlists`, (err, rows) => {
                if (err) return res.sendStatus(400);
                const all_playlists = rows.map(({user_id, playlist_id}) => {
                  return [user_id, playlist_id];
                })
                getRemovePlaylist(all_playlists, remove_playlists, (remove_playlists) => {
                  if(remove_playlists.length > 0) {
                    conn.query(`DELETE FROM user_info WHERE ${remove_playlists.map((remove_playlist) => `(user_id = '${remove_playlist[0]}' AND playlist_id='${remove_playlist[1]}')`).join(' OR ')}`, (err) => {
                      if (err) return res.sendStatus(400);
                      res.send({ success: true });
                    })
                  }
                  else {
                    res.send({ success: true });
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

router.post('/setPassword', (req, res) => {
  const { gridset_id, password, pwd_protected } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.sendStatus(400);
    conn.query(`UPDATE gridsets SET password = '${password}', pwd_protected = ${pwd_protected} WHERE id = '${gridset_id}'`, (err) => {
      if (err) return res.sendStatus(400);
      conn.query(`UPDATE user_gridsets SET pwd_protected = ${pwd_protected} WHERE gridset_id = '${gridset_id}'`, (err) => {
        if (err) return res.sendStatus(400);
        res.send({
          success : true
        })
      })
    })
  })
})

router.post('/updateVisibility', (req, res) => {
  const { gridset_id, visibility } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.sendStatus(400);
    conn.query(`UPDATE gridsets SET visibility = '${visibility}' WHERE id = '${gridset_id}'`, (err) => {
      if (err) return res.sendStatus(400);
      res.send({
        success : true
      })
    })
  })
})

const getRemovePlaylist = (all_playlist_id, remove_playlist_id, callback) =>{
  var _ = require('lodash');
  remove_playlist_id = _.differenceWith(remove_playlist_id, all_playlist_id, _.isEqual);
  callback(remove_playlist_id);
}

module.exports = router;
