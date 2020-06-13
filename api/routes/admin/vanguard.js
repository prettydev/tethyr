const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
          console.log(err);
            return res.sendStatus(400);
        }
        conn.query('SELECT id, username FROM users ORDER BY id', (err, rows) => {
            if (err) {
              console.log(err);
                return res.sendStatus(400);
            }
            res.send({
                users: rows
            });
        });
    });
})

module.exports = router;