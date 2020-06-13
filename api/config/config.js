const config = {
  jwtSecret: 'tethyr',
  admin_email: 'admin@tethyr.io',
  support_email: 'support@tethyr.io',
  password_reset_expiration: 3600, //for an hour
  shared_link_expiration: 1296000, //for 15 days
}

module.exports = config;