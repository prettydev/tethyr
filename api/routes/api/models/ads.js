const getAllAdsOwners = (conn) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM advertisers`, (err, rows) => {
      if(err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...' })
      }
      resolve(rows)
    })
  })
}

const getAllAds = (conn) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT ads.*, advertisers.ad_owner_name FROM ads LEFT JOIN advertisers ON ads.advertiserId = advertisers.id ORDER By ads.id`, (err, rows) => {
      if(err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...' })
      }
      resolve(rows)
    })
  })
}

const getAllAvailableAds = (conn) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT ads.*, advertisers.ad_owner_name FROM ads LEFT JOIN advertisers ON ads.advertiserId = advertisers.id WHERE ads.enabled = true ORDER By ads.id`, (err, rows) => {
      if(err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...' })
      }
      resolve(rows)
    })
  })
}

const createNewAdvertiser = (conn, name) => {
  return new Promise((resolve, reject) => {
    conn.query('INSERT INTO advertisers(ad_owner_name) VALUES (?)', [name], (err) => {
      if(err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...' })
      }
      resolve()
    })
  })
}

const createNewAd = (conn, adName, advertiser_id, localURL, targetURL, duration, adImg) => {
  return new Promise((resolve, reject) => {
    conn.query('INSERT INTO ads(adName, advertiserId, localURL, targetURL, duration, adImg) VALUES (?, ?, ?, ?, ?, ?)', [adName, advertiser_id, localURL, targetURL, duration, adImg], (err) => {
      if(err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...' })
      }
      resolve()
    })
  })
}

const enableAd = (conn, ad_id, ad_enabled) => {
  return new Promise((resolve, reject) => {
    conn.query(`UPDATE ads SET enabled = '${ad_enabled ? 1 : 0}' WHERE id = '${ad_id}'`, (err) => {
      if(err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...' })
      }
      resolve()
    })
  })
}

const removeAd = (conn, ad_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`DELETE FROM ads WHERE id = '${ad_id}'`, (err) => {
      if(err) {
        console.log(err)
        reject({ status: 500, message: 'Internal server error ...' })
      }
      resolve()
    })
  })
}

module.exports = {
  getAllAdsOwners,
  getAllAds,
  createNewAdvertiser,
  createNewAd,
  enableAd,
  getAllAvailableAds,
  removeAd
}