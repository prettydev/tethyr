const express = require('express');
const router = express.Router();

const { decodeString } = require('../../../helpers/decodeString');

router.post('/:userId', (req, res) => {
  const { playlist_id } = req.body;
  const { userId } = req.params;
  req.getConnection((err, conn) => {
    if (err) return res.sendStatus(400);
    conn.query(`SELECT videos.* , dotted, hidden, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = ${playlist_id} AND pd.user_id = ${userId} AND pd.hidden = false ORDER BY pd.playlist_order`, (err, rows) => {
      if (err) return res.sendStatus(400);
      const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored, live_now, datePublish }) => ({
        id: id,
        gsvn : gsvn,
        url: video_id,
        interface: interface_link,
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
        sponsored : sponsored,
        live_now : live_now,
        datePublish : datePublish,
      }))
      res.send({ videos });
    });
  });
});

module.exports = router;
