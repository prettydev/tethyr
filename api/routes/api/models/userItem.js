const { decodeString } = require('../../../modules');

const getPreviewItems = (conn, user_id, playlists, playlist_id, dotfilter, hidefilter, searchfilter) => {
  if(searchfilter.length !== 0) {
    return new Promise((resolve, reject) => {
      var pending = playlists.length;
      playlists.map((playlist, index) => {
        conn.query(`SELECT * FROM (SELECT videos.*, hidden, dotted, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = '${playlist.id}' AND pd.user_id = '${user_id}' AND IF(${parseInt(playlist.id) === parseInt(playlist_id)}, (IF(${hidefilter}, 1, pd.hidden = false) AND IF(${dotfilter}, pd.dotted = true, 1) ORDER BY pd.playlist_order) v WHERE (CONCAT(COALESCE(v.video_type, ''), '', COALESCE(v.video_title, ''), '', COALESCE(v.description, ''), '', COALESCE(v.video_author, '')) LIKE "%${searchfilter}%")), (pd.hidden = false))`, (err, rows) => {
          if (err) {
            reject(err);
          }
          const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored, live_now, datePublish }) => ({
            id: id,
            gsvn : gsvn,
            video_id: video_id,
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
            sponsored : sponsored,
            live_now : live_now,
            datePublish : datePublish,
          }))
          playlists[index].videos = videos;
          if (0 === --pending) {
            resolve(playlists);
          }
        })
      })
    })
  }
  else {
    return new Promise((resolve, reject) => {
      var pending = playlists.length;
      playlists.map((playlist, index) => {
        if(parseInt(playlist.id) === parseInt(playlist_id)) console.log(playlist)
        conn.query(`SELECT videos.*, hidden, dotted, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = '${playlist.id}' AND pd.user_id = '${user_id}' AND IF(${parseInt(playlist.id) === parseInt(playlist_id)}, (IF(${hidefilter}, 1, pd.hidden = false) AND IF(${dotfilter}, pd.dotted = true, 1)), (pd.hidden = false)) ORDER BY pd.playlist_order`, (err, rows) => {
          if (err) {
            reject(err);
          }
          const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored, live_now, datePublish }) => ({
            id: id,
            gsvn : gsvn,
            video_id: video_id,
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
            sponsored : sponsored,
            live_now : live_now,
            datePublish : datePublish,
          }))
          playlists[index].videos = videos;
          if (0 === --pending) {
            resolve(playlists);
          }
        })
      })
    })
  }
}

const saveUserItem = (conn, user_items) => {
  return new Promise((resolve, reject) => {
    conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order) VALUES ?', [user_items], (err) => {
      if (err) {
        console.log(err)
        reject({ message: 'Internal server error ...'});
      }
      resolve({
        success: true
      })
    })
  })
}

const getUserPublicItems = (conn, user_id, playlist_id, dotfilter, hidefilter, searchfilter) => {
  if(searchfilter.length !== 0) {
    return new Promise((resolve, reject) => {
      conn.query(`SELECT * FROM (SELECT videos.*, hidden, dotted, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = '${playlist_id}' AND pd.user_id = '${user_id}' AND IF(${hidefilter}, 1, pd.hidden = false) AND IF(${dotfilter}, pd.dotted = true, 1) ORDER BY pd.playlist_order) v WHERE (CONCAT(COALESCE(v.video_type, ''), '', COALESCE(v.video_title, ''), '', COALESCE(v.description, ''), '', COALESCE(v.video_author, '')) LIKE "%${searchfilter}%")`, (err, rows) => {
        if (err) {
          reject({ status: 500, message: 'Internal server error ...' })
        }
        const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored, live_now, datePublish }) => ({
          id: id,
          gsvn : gsvn,
          video_id: video_id,
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
          sponsored : sponsored,
          live_now : live_now,
          datePublish : datePublish,
        }))
        resolve(videos)
      })
    })
  }
  else {
    return new Promise((resolve, reject) => {
      conn.query(`SELECT videos.*, hidden, dotted, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = '${playlist_id}' AND pd.user_id = '${user_id}' AND IF(${hidefilter}, 1, pd.hidden = false) AND IF(${dotfilter}, pd.dotted = true, 1) ORDER BY pd.playlist_order`, (err, rows) => {
        if (err) {
          reject({ status: 500, message: 'Internal server error ...' })
        }
        const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored, live_now, datePublish }) => ({
          id: id,
          gsvn : gsvn,
          video_id: video_id,
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
          sponsored : sponsored,
          live_now : live_now,
          datePublish : datePublish,
        }))
        resolve(videos)
      })
    })
  }
}

const setUserItemDotted = (conn, user_id, item_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`UPDATE user_info SET dotted = !dotted WHERE video_id = '${item_id}' AND user_id = '${user_id}'`, (err) => {
      if (err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...'});
      }
      resolve({
        success: true
      })
    })
  })
}

const setUserItemHidden = (conn, user_id, item_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`UPDATE user_info SET hidden = !hidden WHERE video_id = '${item_id}' AND user_id = '${user_id}'`, (err) => {
      if (err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...'});
      }
      resolve({
        success: true
      })
    })
  })
}

const brokenItem = (conn, user_id, playlist_id, item_id) => {
  return new Promise((resolve, reject) => {
    var date = new Date();
    date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    conn.query(`UPDATE videos SET dead = 1, dateTimeReportDead = '${date}' WHERE id = ${item_id}`, (err) => {
      if (err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...'});
      }
      resolve({
        success: true
      })
    })
  })
}

const removeUserItem = (conn, user_id, playlist_id, item_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT playlist_order FROM user_info WHERE video_id = '${item_id}' AND playlist_id = '${playlist_id}' AND user_id = '${user_id}'`, (err, rows) => {
			if (err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...'});
      }
			const order = rows[0].playlist_order;
			conn.query('UPDATE user_info SET playlist_order = playlist_order - 1 WHERE playlist_id = ? AND playlist_order > ? AND user_id = ?', [playlist_id, order, user_id], (err) => {
				if (err) {
          console.log(err)
          reject({ status: 500, message: 'Internal server error ...'});
        }
				conn.query('DELETE FROM user_info WHERE video_id = ? AND playlist_id = ? AND user_id = ?', [item_id, playlist_id , user_id], (err) => {
					if (err) {
            console.log(err)
            reject({ status: 500, message: 'Internal server error ...'});
          };
					
          resolve({
            success: true
          })
				})
			})
		})
  })
}

module.exports = {
  getPreviewItems,
  saveUserItem,
  getUserPublicItems,
  setUserItemDotted,
  setUserItemHidden,
  brokenItem,
  removeUserItem
}