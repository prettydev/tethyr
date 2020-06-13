const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  
    let token = req.headers['authorization'];
    var request = require('request');
    var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
    var headers = { 
      Authorization: `${token}`
    };
    // request.get({ url: url,  headers: headers }, function (e, r, body) {
    //     if(!e && r.statusCode == 200) {
            req.getConnection((err, conn) => {
                if (err) {
                    return res.sendStatus(400);
                }
                conn.query('SELECT * FROM platforms', (err, rows) => {
                    if (err) {
                        return res.sendStatus(400);
                    }
                    res.send({
                        platforms: rows
                    });
                });
            });
    //     }
    //     else {
    //         res.send({ status: 401, message: 'Unauthorized request!'});
    //     }
    // });
})

router.post('/', (req, res) => {
    const { name } = req.body;
    let token = req.headers['authorization'];
    var request = require('request');
    var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
    var headers = { 
      Authorization: `${token}`
    };
    // request.get({ url: url,  headers: headers }, function (e, r, body) {
    //     if(!e && r.statusCode == 200) {
            req.getConnection((err, conn) => {
                if (err) return res.sendStatus(400);
                conn.query('INSERT INTO platforms (name) VALUES (?)', [[name]], (err, result) => {
                    if (err) return res.sendStatus(400);
                    const id = result.insertId;
                    res.send({
                        success: true
                    });
                })
            })
    //     }
    //     else {
    //         res.send({ status: 401, message: 'Unauthorized request!'});
    //     }
    // });
})

router.delete('/:id', (req, res) => {
    
    const { id } = req.params;
    let token = req.headers['authorization'];
    var request = require('request');
    var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
    var headers = { 
      Authorization: `${token}`
    };
    // request.get({ url: url,  headers: headers }, function (e, r, body) {
    //     if(!e && r.statusCode == 200) {
            req.getConnection((err, conn) => {
                if (err) return res.sendStatus(400);
                conn.query('DELETE FROM platforms WHERE id=?', id, (err) => {
                    if (err) return res.sendStatus(400);
                    res.send({ success: true });
                });
            })
    //     }
    //     else {
    //         res.send({ status: 401, message: 'Unauthorized request!'});
    //     }
    // });
})

module.exports = router;
