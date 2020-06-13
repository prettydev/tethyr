const findPlaylist = (conn, gridsets) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM gridset_data WHERE gridset_id IN (${gridsets.map((gridset_id) => `${gridset_id[1]}`).join(', ')}) ORDER BY gridset_id, playlist_order`, (err,rows) => {
      if (err) {
        console.log(err)
        reject({ message: 'Internal server error ...'});
      }
      resolve(rows)
    })
  })
}

module.exports = {
  findPlaylist,
}