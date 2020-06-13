
const express = require('express');
const router = express.Router();

router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  req.getConnection((err, conn) => {
    if (err) {console.log(err); return res.sendStatus(400);}
    conn.query(`SELECT COUNT(*) FROM user_gridsets WHERE user_id = '${userId}'`, (err, rows) => {
      if (err) {console.log(err); return res.sendStatus(400);}
      const count = rows[0]['COUNT(*)'];
      if (count > 0) {
        res.send({
          success : false,
        })
      }
      else {
        res.send({
          success : true,
        })
      }
    });
  });
})

router.post('/saveUserInfo/:userId', (req, res) => {
  const { userId } = req.params;
  req.getConnection((err, conn) => {
    if (err) return res.sendStatus(400);
    conn.query(`SELECT * FROM default_gridset ORDER BY gridset_order`, (err, rows) => {
      if (err) return res.sendStatus(400);
      if(rows.length === 0) {
        res.send({
          success : true
        })
      }
      else {
        const user_gridsets = rows.map(({gridset_id, gridset_order}) => {
          return [userId, gridset_id, gridset_order]
        })
        conn.query('INSERT INTO user_gridsets(user_id, gridset_id, sort_id) VALUES ?', [user_gridsets], (err) => {
          if (err) return res.sendStatus(400);
          conn.query(`SELECT * FROM gridset_data WHERE gridset_id IN (${user_gridsets.map((gridset_id) => `${gridset_id[1]}`).join(', ')}) ORDER BY playlist_order`, (err,rows) => {
            if (err) return res.sendStatus(400);
            const user_playlists = rows.map(({gridset_id, playlist_id, playlist_order}) => {
                return [userId, gridset_id, playlist_id, playlist_order];
            })
            conn.query('INSERT INTO user_playlists(user_id, gridset_id, playlist_id, playlist_order) VALUES ?', [user_playlists], (err) => {
              if (err) return res.sendStatus(400);
              conn.query(`SELECT playlist_data.playlist_id, playlist_data.playlist_order, playlist_data.video_id
                          FROM playlist_data 
                          JOIN videos on playlist_data.video_id = videos.id
                          WHERE videos.dead = 0 AND playlist_data.playlist_id IN (${user_playlists.map((user_playlist) => `${user_playlist[2]}`).join(', ')})`, (err, rows) => {
                if (err) return res.sendStatus(400);
                const user_info = rows.map(({playlist_id, playlist_order, video_id}) => {
                  return [userId, playlist_id, video_id, playlist_order]
                })
                conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order) VALUES ?', [user_info], (err) => {
                  if (err) return res.sendStatus(400);
                  res.send({
                    success : true,
                  })
                })
              })
            })
          })
        })
      }
    })
  })
})

module.exports = router;