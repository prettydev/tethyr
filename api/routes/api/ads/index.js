const express = require('express');
const router = express.Router();
const {
  getAllAdsOwners,
  getAllAds,
  createNewAdvertiser,
  createNewAd,
  enableAd,
  getAllAvailableAds,
  removeAd
} = require('../models/ads')

router.get('/getAllAdsOwners', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    getAllAdsOwners(conn)
    .then(data => {
      res.send({
        data
      })
    })
    .catch(err => {return res.status(500).send({ message: 'Internal server error ...'});})
  });
})

router.get('/getAllAds', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    getAllAds(conn)
    .then(data => {
      res.send({
        data
      })
    })
    .catch(err => {return res.status(500).send({ message: 'Internal server error ...'});})
  });
})

router.get('/getAllAvailableAds', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    getAllAvailableAds(conn)
    .then(data => {
      res.send({
        data
      })
    })
    .catch(err => {return res.status(500).send({ message: 'Internal server error ...'});})
  });
})

router.post('/createNewAdvertiser', (req, res) => {
  const { name } = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    createNewAdvertiser(conn, name)
    .then(() => {
      getAllAdsOwners(conn)
      .then(data => {
        res.send({
          success: true,
          data
        })
      })
      .catch(err => {return res.status(500).send({ message: 'Internal server error ...'});})
    })
    .catch(err => {return res.status(500).send({ message: 'Internal server error ...'});})
  });
})

router.post('/createNewAd', (req, res) => {
  const { adName, advertiser_id, localURL, targetURL, duration, adImg } = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    createNewAd(conn, adName, advertiser_id, localURL, targetURL, duration, adImg)
    .then(() => {
      getAllAds(conn)
      .then(data => {
        res.send({
          data
        })
      })
      .catch(err => {return res.status(500).send({ message: 'Internal server error ...'});})
    })
    .catch(err => {return res.status(500).send({ message: 'Internal server error ...'});})
  });
})

router.post('/enableAds', (req, res) => {
  const { ad_id, ad_enabled } = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    enableAd(conn, ad_id, ad_enabled)
    .then(() => {
      getAllAds(conn)
      .then(data => {
        res.send({
          data
        })
      })
      .catch(err => {return res.status(err.status).send({ message: err.message});})
    })
    .catch(err => {return res.status(err.status).send({ message: err.message});})
  });
})

router.post('/removeAds', (req,res) => {
  const { ad_id } = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.sendStatus(400);
    }
    removeAd(conn, ad_id)
    .then(() => {
      getAllAds(conn)
      .then(data => {
        res.send({
          data
        })
      })
      .catch(err => {return res.status(err.status).send({ message: err.message});})
    })
    .catch(err => {return res.status(err.status).send({ message: err.message});})
  });
})

module.exports = router;