const getPreviewPlaylists = (conn, user_id, gridset_id, ganged_gridset) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT playlist_id, playlist_ganged FROM user_playlists WHERE gridset_id = ${gridset_id} AND user_id = ${user_id} ORDER BY 
                  CASE ${ganged_gridset}
                    WHEN 1 THEN playlist_ganged
                    ELSE 1 
                  END DESC, playlist_order`, (err, rows) => {
      if (err) {
        reject({ status: 500, message: 'Internal server error ...'});
      }
      const previewPlaylists = rows.map(({playlist_id, playlist_ganged }) => {
        return {
          id: playlist_id,
          playlist_ganged : playlist_ganged
        };
      });
      resolve(previewPlaylists);
    })
  })
}

const saveUserPlaylist = (conn, user_playlists) => {
  return new Promise((resolve, reject) => {
    conn.query('INSERT INTO user_playlists(user_id, gridset_id, playlist_id, playlist_order) VALUES ?', [user_playlists], (err) => {
      if (err) {
        reject({ status: 500, message: 'Internal server error ...'});
      }
      resolve({
        success: true
      })
    })
  })
}

const getUserPublicPlaylists = (conn, user_id, gridset_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT playlists.*, pd.playlist_auto_update, pd.playlist_ganged, pd.ganged_pwd, pd.playlist_order FROM playlists INNER JOIN user_playlists pd ON playlists.id = pd.playlist_id AND pd.user_id = '${user_id}' AND pd.gridset_id = '${gridset_id}' ORDER BY pd.playlist_order`, (err, rows) => {
      if(err) {
        reject({ status: 500, message: 'Internal server error ...' })
      }
      resolve(rows)
    })
  })
}

module.exports = {
  getPreviewPlaylists,
  saveUserPlaylist,
  getUserPublicPlaylists,
}