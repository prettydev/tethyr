const findDefaultGridset = (conn) => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM default_gridset ORDER BY gridset_order', (err, rows) => {
      if (err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...' })
      }
      resolve(rows);
    })
  })
}

const removePlaylistsByGridsetId = (conn, gridset_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`DELETE FROM gridset_data WHERE gridset_id = '${gridset_id}'`, (err) => {
      if (err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...' })
      }
      resolve()
    })
  })
}

const addPlaylistsToGridset = (conn, gridset_data) => {
  return new Promise((resolve, reject) => {
    conn.query(`INSERT INTO gridset_data(gridset_id, playlist_id, playlist_order) VALUES ?`, [gridset_data], (err) => {
      if (err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...' })
      }
      resolve()
    })
  })
}

module.exports = {
  findDefaultGridset,
  removePlaylistsByGridsetId,
  addPlaylistsToGridset,
}