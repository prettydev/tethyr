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
                conn.query('SELECT user_id, GROUP_CONCAT(gridset_id) griset_ids FROM user_gridsets GROUP BY user_id', (err, rows) => {
                    if (err) return res.sendStatus(400);
                    const gridsets = rows.map(({ user_id, griset_ids, ...rest }) => {
                        const gridset_id = griset_ids ? griset_ids.split(',').map(id => +id) : [];
                        return {
                            ...rest,
                            user_id,
                            gridset_id
                        }
                    });
                    res.send({
                        gridsets
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
    
    const { id } = req.body;
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
                conn.query(`SELECT user_id, gridset_id, gridsets.name, gridsets.description , sort_id FROM gridsets INNER JOIN user_gridsets pd ON gridsets.id = pd.gridset_id AND  pd.user_id = ${id}  ORDER BY pd.sort_id`, (err, rows) => {
                    if (err) {
                        return res.sendStatus(400);
                    }
                    res.send({
                        gridsets: rows
                    });
                });
            });
    //     }
    //     else {
    //         res.send({ status: 401, message: 'Unauthorized request!'});
    //     }
    // });
})

module.exports = router;