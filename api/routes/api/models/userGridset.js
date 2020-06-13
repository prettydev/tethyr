const checkGridsetGanged = (conn, user_id, gridset_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT ganged_gridset FROM user_gridsets WHERE gridset_id = ${gridset_id} AND user_id = '${user_id}'`, (err, rows) => {
      if (err) {
        reject(err);
      }
      const ganged_gridset = rows[0].ganged_gridset;
      resolve(ganged_gridset);
    })
  })
}

const saveUserGridset = (conn, user_gridsets) => {
  return new Promise((resolve, reject) => {
    conn.query('INSERT INTO user_gridsets(user_id, gridset_id, sort_id) VALUES ?', [user_gridsets], (err) => {
      if (err) {
        reject({status: 500, message: 'Internal server error ...'});
      }
      resolve({
        success: true
      })
    })
  })
}

const getUserPublicGridsets = (conn, user_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT gridsets.*, pd.locked, pd.ganged_gridset, pd.sort_id FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND pd.user_id = '${user_id}' AND pd.status = 1 ORDER BY pd.sort_id`, (err, rows) => {
      if(err)
        reject({ status: 500, message: 'Internal server error ...' })
      resolve(rows)
    })
  })
}

const getUserPlaylistsByGridsetId = (conn, user_id, gridset_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM user_playlists WHERE user_id = '${user_id}' AND gridset_id = '${gridset_id}'`, (err, rows) => {
      if(err)
        reject({ status: 500, message: 'Internal server error ...' })
      resolve(rows)
    })
  })
}

module.exports = {
  checkGridsetGanged,
  saveUserGridset,
  getUserPublicGridsets,
  getUserPlaylistsByGridsetId,
}