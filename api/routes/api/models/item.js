const findItem = (conn, user_playlists) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT playlist_data.playlist_id, playlist_data.playlist_order, playlist_data.video_id
                FROM playlist_data 
                JOIN videos on playlist_data.video_id = videos.id
                WHERE videos.dead = 0 AND playlist_data.playlist_id IN (${user_playlists.map((user_playlist) => `${user_playlist[2]}`).join(', ')}) ORDER BY playlist_id, playlist_order`, (err, rows) => {
      if (err) {
        console.log(err)
        reject({ message: 'Internal server error ...'});
      }
      resolve(rows)
    })
  })
}

module.exports = {
  findItem,
}