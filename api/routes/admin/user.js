
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.sendStatus(400);
        }
        conn.query('SELECT user_id FROM user_gridsets GROUP BY user_id', (err, rows) => {
            if (err) {
                return res.sendStatus(400);
            }
            res.send({
                gridsets: rows
            });
        });
    });
})

module.exports = router;