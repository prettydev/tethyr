const express = require('express');
const router = express.Router();
const checkToken = require('../../../helpers/checkToken');
const {
  getUserPublicItems,
  setUserItemDotted,
  setUserItemHidden,
  brokenItem,
  removeUserItem
} = require('../models/userItem')

router.post('/userItemOrderSwap', (req, res) => {
	const currentEmail = checkToken(req);
  const { user_id, currentPlaylist, source_id, destination_id } = req.body;
  if(currentEmail) {
		req.getConnection((err, conn) => {
			if (err) {
        return res.status(400).send({ message: 'Database Connection Failed!'});
      }
      console.log(user_id, currentPlaylist, source_id, destination_id)
      conn.query(`SELECT video_id, playlist_order FROM user_info WHERE user_id = '${user_id}' AND playlist_id = '${currentPlaylist}' AND video_id IN(${source_id}, ${destination_id}) ORDER BY FIELD(video_id, ${source_id}, ${destination_id})`, (err, rows) => {
        if (err) {
          return res.status(500).send({ message: 'Internal server error ...'});
        }
        const source_order = rows[0]['playlist_order'];
        const destination_order = rows[1]['playlist_order'];
        if(source_order > destination_order) {
          conn.query(`UPDATE user_info SET playlist_order =
                        CASE
                          WHEN playlist_order >= '${destination_order}' && playlist_order < '${source_order}' then playlist_order + 1
                          ELSE playlist_order
                        END
                        WHERE user_id = '${user_id}' AND playlist_id = '${currentPlaylist}'
          `, (err) => {
            if (err) {
              return res.status(500).send({ message: 'Internal server error ...'});
            }
            conn.query(`UPDATE user_info SET playlist_order = '${destination_order}' WHERE user_id = '${user_id}' AND playlist_id = '${currentPlaylist}' AND video_id = '${source_id}'`, (err) => {
              if (err) {
                return res.status(500).send({ message: 'Internal server error ...'});
              }
              res.send({
                success: true,
              })
            })
          })
        }
        else {
          conn.query(`UPDATE user_info SET playlist_order =
                        CASE
                          WHEN playlist_order > '${source_order}' && playlist_order <= '${destination_order}' then playlist_order - 1
                          ELSE playlist_order
                        END
                        WHERE user_id = '${user_id}' AND playlist_id = '${currentPlaylist}'
          `, (err) => {
            if (err) {
              return res.status(500).send({ message: 'Internal server error ...'});
            }
            conn.query(`UPDATE user_info SET playlist_order = '${destination_order}' WHERE user_id = '${user_id}' AND playlist_id = '${currentPlaylist}' AND video_id = '${source_id}'`, (err) => {
              if (err) {
                return res.status(500).send({ message: 'Internal server error ...'});
              }
              res.send({
                success: true,
              })
            })
          })
        }
      })
		})
	}
	else {
    return res.status(401).send({ message: 'Unauthorized request!'});
  }
})

router.get('/getUserAllItem/:userId/:playlist_id/:per_page/:page', (req, res) => {
  const currentEmail = checkToken(req);
  const { userId, playlist_id, per_page, page } = req.params;
  if(currentEmail) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(400).send({ message: 'Database Connection Failed!'});
      }
      if(per_page === 'all') {
        conn.query(`SELECT videos.* , dotted, hidden, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = '${playlist_id}' AND pd.user_id = '${userId}' ORDER BY pd.playlist_order`, (err, rows) => {
          if (err) {
            return res.sendStatus(400);
          }
          res.send({
            data: rows
          })
        })
      }
      else {
        conn.query(`SELECT COUNT (*) FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = '${playlist_id}' AND pd.user_id = '${userId}'`, (err, rows) => {
                      if (err) {
                        return res.sendStatus(400);
                      }
                      const total = rows[0]['COUNT (*)'];
                      const total_pages = Math.ceil( total / per_page );
                      conn.query(`SELECT videos.* , dotted, hidden, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = '${playlist_id}' AND pd.user_id = '${userId}' ORDER BY pd.playlist_order LIMIT ${per_page * (page - 1)}, ${per_page}`, (err, rows) => {
                        if (err) {
                          return res.sendStatus(400);
                        }
                        else if(total !== 0 && rows.length === 0) {
                          conn.query(`SELECT videos.* , dotted, hidden, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = '${playlist_id}' AND pd.user_id = '${userId}' ORDER BY pd.playlist_order LIMIT ${per_page * (page - 2)}, ${per_page}`, (err, rows) => {
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
    return res.status(401).send({ message: 'Unauthorized request!'});
  }
})

router.get('/getUserPublicItems/:userId/:playlist_id', (req, res) => {
  const currentEmail = checkToken(req);
  const { userId, playlist_id } = req.params;
  let dotfilter = req.query.dotFilter;
  let hidefilter = req.query.hideFilter;
  let searchfilter = req.query.searchFilter;
  if(currentEmail) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(400).send({ message: 'Database Connection Failed!'});
      }
      getUserPublicItems(conn, userId, playlist_id, dotfilter, hidefilter, searchfilter)
      .then((items) => {
        res.send({
          items
        })
      })
      .catch(err => {
        res.status(err.status).send(err.message)
      })
    });
  }
  else {
    return res.status(401).send({ message: 'Unauthorized request!'});
  }
})

router.post('/setItemDotted', (req, res) => {
	const currentEmail = checkToken(req);
  const { user_id, item_id} = req.body;
  if(currentEmail) {
		req.getConnection((err, conn) => {
			if (err) {
        return res.status(400).send({ message: 'Database Connection Failed!'});
      }
      setUserItemDotted(conn, user_id, item_id)
      .then(() => {
        res.send({
          success: true,
        })
      })
      .catch(err => {
        res.status(err.status).send(err.message)
      })
		})
	}
	else {
    return res.status(401).send({ message: 'Unauthorized request!'});
  }
})

router.post('/setItemHidden', (req, res) => {
	const currentEmail = checkToken(req);
  const { user_id, item_id} = req.body;
  if(currentEmail) {
		req.getConnection((err, conn) => {
			if (err) {
        return res.status(400).send({ message: 'Database Connection Failed!'});
      }
      setUserItemHidden(conn, user_id, item_id)
      .then(() => {
        res.send({
          success: true,
        })
      })
      .catch(err => {
        res.status(err.status).send(err.message)
      })
		})
	}
	else {
    return res.status(401).send({ message: 'Unauthorized request!'});
  }
})

router.post('/setItemBroken', (req, res) => {
	const currentEmail = checkToken(req);
  const { user_id, playlist_id, item_id} = req.body;
  if(currentEmail) {
		req.getConnection((err, conn) => {
			if (err) {
        return res.status(400).send({ message: 'Database Connection Failed!'});
      }
      brokenItem(conn, user_id, playlist_id, item_id)
      .then(() => {
        res.send({
          success: true,
        })
      })
      .catch(err => {
        res.status(err.status).send(err.message)
      })
		})
	}
	else {
    return res.status(401).send({ message: 'Unauthorized request!'});
  }
})

router.post('/setItemRemove', (req, res) => {
	const currentEmail = checkToken(req);
  const { user_id, playlist_id, item_id} = req.body;
  if(currentEmail) {
		req.getConnection((err, conn) => {
			if (err) {
        return res.status(400).send({ message: 'Database Connection Failed!'});
      }
      removeUserItem(conn, user_id, playlist_id, item_id)
      .then(() => {
        res.send({
          success: true,
        })
      })
      .catch(err => {
        res.status(err.status).send(err.message)
      })
		})
	}
	else {
    return res.status(401).send({ message: 'Unauthorized request!'});
  }
})

module.exports = router;