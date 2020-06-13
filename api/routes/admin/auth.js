const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.send({
        success: false,
        msg: 'Database Connection Failed!'
      });
    }
    conn.query(`SELECT id FROM admins WHERE email='${email}' AND password='${password}'`, (err, rows) => {
      if (err) {
        return res.send({
          success: false,
          msg: 'Server Internal Error!'
        });
      }
      if (rows.length === 0) {
        return res.send({
          success: false,
          msg: 'Email or Password is Incorrect!'
        });
      }
      res.send({
        success: true,
        id: rows[0].id
      });
    });
  });  
});

module.exports = router;
