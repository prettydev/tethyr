const express = require('express');
const router = express.Router();

router.post('/metaLoginInfo', (req, res) => {
  const { userName, pwd } = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.send({
        success: false,
        msg: 'Database Connection Failed!'
      });
    }
    conn.query(`SELECT id FROM admins WHERE email='${userName}' AND password='${pwd}'`, (err, rows) => {
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
