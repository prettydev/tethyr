const express = require('express')
const checkToken = require("../../../helpers/checkToken")
const {query, getUserId} = require('../../../helpers/query')

const router = express.Router()
module.exports = router

router.get('/', async (req, res) => {
  const email = checkToken(req)
  const accounts = {}
  const rows = await query(
    req, `
      SELECT service, external_id FROM user_external_accounts
      JOIN users ON users.id = user_external_accounts.user_id
      WHERE users.email_lowercased = lower(?)
    `, [email]
  )
  rows.forEach(({service, external_id}) =>
    accounts[service] = external_id
  )

  res.send(accounts)
})

router.post('/', async (req, res) => {
  const userId = await getUserId(req)
  if (!userId) return

  const {service, externalId} = req.body
  await query(
    req,
    `INSERT INTO user_external_accounts(user_id, service, external_id) VALUES (${userId}, ?, ?)`,
    [service, externalId]
  )

  res.sendStatus(200)
})

router.delete('/', async (req, res) => {
  const userId = await getUserId(req)
  if (!userId) return

  const {service} = req.body
  await query(req, `DELETE FROM user_external_accounts WHERE user_id = ${userId} AND service = ?`, [service])

  res.sendStatus(200)
})
