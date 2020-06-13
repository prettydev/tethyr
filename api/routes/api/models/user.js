const validateEmail = require('../../../helpers/validateEmail');

const findUserByEmailAndName = (conn, name) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM users WHERE IF(${validateEmail(name)}, email_lowercased = '${name.toLowerCase()}', username = '${name}')`, (err, rows) => {
      if(err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...' })
      }
      const user = rows[0];
      resolve(user)
    })
  })
}

const saveUserInfo = (conn, user) => {
  return new Promise((resolve, reject) => {
    conn.query('INSERT INTO users(unique_id, email, email_lowercased, username, password, first_name, last_name, confirmation_token, role_id, status, created_at, updated_at, confirmed_at) VALUES (?)', [user], (err, rows) => {
      if(err) {
        reject({ message: 'Internal server error ...'});
      }
      const user_id = rows.insertId;
      resolve(user_id)
    })
  })
}

module.exports = {
  findUserByEmailAndName,
  saveUserInfo,
}