/**
 * Copyright (c) 2020
 *
 * /plans
 * /addons
 * /subscribe
 * /subscribe-postproc
 * /addons-checkout
 * /addons-postproc
 *
 * @summary chargebee api
 * @author Pretty Dev <creditcoder@gmail.com>
 *
 * Created at     : 2020-04-17 11:20:56
 * Last modified  : 2020-06-02 05:21:10
 */

const express = require("express");
const router = express.Router();
const checkToken = require("../../../helpers/checkToken");

const jwt = require("jsonwebtoken");
const config = require("../../../config/config");

const chargebee = require("chargebee");
// CORS is enabled only for demo. Please dont use this in production unless you know about CORS
const cors = require("cors");

const chargebee_test_config = {
  site: process.env.CHARGEBEE_TEST_SITE,
  api_key: process.env.CHARGEBEE_TEST_KEY,
};

const chargebee_live_config = {
  site: process.env.CHARGEBEE_LIVE_SITE,
  api_key: process.env.CHARGEBEE_LIVE_KEY,
};

const chargebee_config =
  process.env.CHARGEBEE_LIVE_STATE === "true"
    ? chargebee_live_config
    : chargebee_test_config;

console.log(chargebee_config);
chargebee.configure(chargebee_config);

/**
 * get plan list
 */
router.get("/plans", (req, res) => {
  chargebee.plan
    .list({
      limit: 3,
      "status[is]": "active",
    })
    .request(function (error, result) {
      if (error) {
        console.log(error);
      } else {
        for (var i = 0; i < result.list.length; i++) {
          var entry = result.list[i];
          // console.log(entry);
        }
        res.send(result.list);
      }
    });
});

/**
 * get addons list
 */
router.get("/addons", (req, res) => {
  chargebee.addon
    .list({
      limit: 20,
      "status[is]": "active",
    })
    .request(function (error, result) {
      if (error) {
        console.log(error);
      } else {
        for (var i = 0; i < result.list.length; i++) {
          var entry = result.list[i];
          // console.log(entry);
        }
        res.send(result.list);
      }
    });
});

/**
 * membership logic
 */
router.post("/subscribe", (req, res) => {
  const {
    plan_id,
    email,
    first_name,
    last_name,
    subscription_id,
    id,
  } = req.body;

  console.log(id, "...customer id");

  const config = {
    subscription: {
      plan_id,
    },
    customer: {
      id, //email,
      email,
      first_name,
      last_name,
    },
  };
  console.log(subscription_id, " subscription_id");
  if (subscription_id) {
    console.log("checkout_existing");
    chargebee.hosted_page
      .checkout_existing({
        subscription: {
          id: subscription_id,
          plan_id,
        },
      })
      .request(function (error, result) {
        if (error) {
          //handle error
          console.log(error);
        } else {
          console.log(result);
          res.send(result.hosted_page);
        }
      });
  } else {
    console.log("checkout_new");
    chargebee.hosted_page
      .checkout_new(config)
      .request(function (error, result) {
        if (error) {
          console.log("subscribe", error, result);
        } else {
          // need to check the success state here and call the update user role api
          console.log(result);
          res.send(result.hosted_page);
        }
      });
  }
});

/**
 * get subscription details and update user role and subscription_id
 */
router.post("/subscribe-postproc", (req, res) => {
  const currentEmail = checkToken(req);
  if (currentEmail) {
    const { email, role_id, hostedPageId } = req.body;

    chargebee.hosted_page
      .acknowledge(hostedPageId)
      .request(function (error, result) {
        if (error) {
          console.log(error);
        } else {
          const subscription_id = result.hosted_page.content.subscription.id;
          req.getConnection((err, conn) => {
            conn.query(
              `UPDATE users SET
                      role_id = '${role_id}',
                      subscription_id = '${subscription_id}'                 
                    WHERE email_lowercased = '${currentEmail.toLowerCase()}'`,
              (err) => {
                if (err) {
                  return res
                    .status(500)
                    .send({ message: "Internal server error ..." });
                }
                conn.query(
                  `SELECT * FROM users WHERE email_lowercased = '${email.toLowerCase()}'`,
                  (err, rows) => {
                    if (err) {
                      return res
                        .status(500)
                        .send({ message: "Internal server error ..." });
                    }

                    const user = rows[0];
                    res.send({
                      status: 200,
                      user: {
                        user_id: user.id,
                        email: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        userName: user.username,
                        token: jwt.sign(user.email, config.jwtSecret, {}),
                        role: user.role_id,
                        status: user.status,
                        created_at: user.created_at,
                        updated_at: user.updated_at,
                        subscription_id: user.subscription_id,
                      },
                    });
                  }
                );
              }
            );
          });
        }
      });
  } else {
    return res.status(401).send({ message: "Unauthorized request!" });
  }
});

/**
 * checkout addons
 */
router.post("/addons-checkout", (req, res) => {
  const { id, role_id, addon_id } = req.body;

  const plans = ["cbdemo_free", "pro", "verified-identity"];

  const config = {
    subscription: {
      id,
      plan_id: plans[role_id],
    },
    addons: [
      {
        id: addon_id,
      },
    ],
  };

  console.log("addon request from the client............", config);

  chargebee.hosted_page
    .checkout_existing(config)
    .request(function (error, result) {
      if (error) {
        //handle error
        console.log(error);
      } else {
        console.log(result);
        res.send(result.hosted_page);
      }
    });
});

/**
 * 
 * try {
            chargebee.subscription
              .create_for_customer(user_id, {
                plan_id: "cbdemo_free",                
              })
              .request(function (error, result) {
                if (error) {
                  console.log(error);
                } else {
                  console.log(result);
                  var subscription = result.subscription;
                  var customer = result.customer;
                  var card = result.card;
                  var invoice = result.invoice;
                  var unbilled_charges = result.unbilled_charges;
                }
              });
          } catch (e) {
            console.log(e, "error while creating addon subscriptions");
          }
 */

/**
 * addons post proc
 */
router.post("/addons-postproc", (req, res) => {
  const { hostedPageId, addon_id } = req.body;
  console.log(hostedPageId, "...hostedPageId");

  chargebee.hosted_page
    .acknowledge(hostedPageId)
    .request(function (error, result) {
      if (error) {
        console.log("error...", error);
      } else {
        console.log("result...", result);

        let subscription_id = result.hosted_page.content.subscription_id;
        let customer_id = result.hosted_page.content.customer.id;
        let card_id = result.hosted_page.content.card.id;
        let invoice_id = result.hosted_page.content.invoice.id;

        //subscription_id, card_id    :   undefined
        console.log(customer_id, invoice_id, addon_id);
        //do custom proc
      }
    });
});

module.exports = router;
