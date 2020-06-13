const checkToken = require('./checkToken')

const getConnection = (req) =>
  new Promise((resolve, reject) =>
    req.getConnection((err, conn) =>
      err ? reject(err) : resolve(conn)
    )
  )

exports.getConnection = getConnection

const query = async (req, query, args = []) => {
  let conn = req.mysqlConnection
  if (!conn) req.mysqlConnection = conn = await getConnection(req)

  return await new Promise((resolve, reject) => {
    conn.query(query, args, (err, rows) =>
      err ? reject(err) : resolve(rows)
    )
  })
}

exports.query = query

exports.getUserId = async (req) => {
  const email = checkToken(req)
  const [row] = await query(req, 'SELECT id FROM users WHERE email_lowercased = lower(?)', [email])
  return row ? row.id : res.status(401).send({ message: "Unauthorized request!" });
}
