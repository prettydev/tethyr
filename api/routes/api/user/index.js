const auth = require("basic-auth");
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");
const crypto = require("crypto");
const config = require("../../../config/config");
const checkToken = require("../../../helpers/checkToken");
const mailSender = require("../../../helpers/mailSender");
const emailBuilder = require("../../../helpers/emailBuilder");
const validateEmail = require("../../../helpers/validateEmail");
const externalAccounts = require("./externalAccounts");
const router = express.Router();

const { findUserByEmailAndName, saveUserInfo } = require("../models/user");

const { findDefaultGridset } = require("../models/gridset");

const { findPlaylist } = require("../models/playlist");

const { findItem } = require("../models/item");

const { saveUserGridset } = require("../models/userGridset");

const { saveUserPlaylist } = require("../models/userPlaylist");

const { saveUserItem } = require("../models/userItem");

/**
 * Login
 *
 */
router.post("/login", (req, res) => {
  const credentials = auth(req);
  if (!credentials) {
    res.status(401).send({ message: "Invalid request!" });
  } else {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(400).send({ message: "Database Connection Failed!" });
      }
      findUserByEmailAndName(conn, credentials.name)
        .then((user) => {
          if (!user) {
            res.status(404).send({
              message: `Cannot find ${
                validateEmail(credentials.name) ? "Email address!" : "Username!"
              }`,
            });
          } else {
            const hashedPassword = user.password;
            if (bcrypt.compareSync(credentials.pass, hashedPassword)) {
              // correct user
              res.status(200).send({
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
            } else {
              // incorrect password
              return res
                .status(401)
                .send({ message: "Password is not correct!" });
            }
          }
        })
        .catch((err) => res.status(404).send(err));
    });
  }
});

/**
 * Register
 *
 */
router.post("/register", (req, res) => {
  const { email, password, firstName, lastName, userName } = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.status(400).send({ message: "Database Connection Failed!" });
    }
    findUserByEmailAndName(conn, email)
      .then((userInfo) => {
        if (userInfo) {
          return res
            .status(409)
            .send({ message: "That email are using by the other someone!" });
        }
        findUserByEmailAndName(conn, userName)
          .then((userInfo) => {
            if (userInfo) {
              return res
                .status(409)
                .send({ message: "The duplicated username!" });
            }
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password || uniqid(), salt);
            const created_at = new Date();
            const updated_at = new Date();
            const status = "Unconfirmed";
            const confirmation_token = crypto.randomBytes(16).toString("hex");
            const unique_id = "tethyr_" + bcrypt.hashSync(userName, salt);
            const role_id = 0;
            const email_lowercased = email.toLowerCase();
            const confirmed_at = null;
            const user = [
              unique_id,
              email,
              email_lowercased,
              userName,
              hash,
              firstName,
              lastName,
              confirmation_token,
              role_id,
              status,
              created_at,
              updated_at,
              confirmed_at,
            ];
            saveUserInfo(conn, user)
              .then((user_id) => {
                findDefaultGridset(conn)
                  .then((gridsets) => {
                    if (gridsets.length === 0) {
                      const confirmURL = `${process.env.CLIENT_URL}/auth/${unique_id}/confirm_verification?token=${confirmation_token}`;
                      mailSender(
                        "Tethyr",
                        config.support_email,
                        [email],
                        "Welcome",
                        emailBuilder.buildWelcomeEmail()
                      );
                      mailSender(
                        "Tethyr",
                        config.support_email,
                        [email],
                        "Confirm",
                        emailBuilder.buildConfirmEmail(confirmURL)
                      );
                      const token = jwt.sign(email, config.jwtSecret, {});
                      res.send({
                        status: 200,
                        message: "User has been registered!",
                        user: {
                          user_id: user_id,
                          email: email,
                          firstName: firstName,
                          lastName: lastName,
                          userName: userName,
                          token: token,
                          status: status,
                          role: role_id,
                          created_at: new Date(),
                          updated_at: new Date(),
                        },
                      });
                    } else {
                      const user_gridsets = gridsets.map(
                        ({ gridset_id, gridset_order }) => {
                          return [user_id, gridset_id, gridset_order];
                        }
                      );
                      saveUserGridset(conn, user_gridsets)
                        .then(() => {
                          findPlaylist(conn, user_gridsets)
                            .then((playlists) => {
                              const user_playlists = playlists.map(
                                ({
                                  gridset_id,
                                  playlist_id,
                                  playlist_order,
                                }) => {
                                  return [
                                    user_id,
                                    gridset_id,
                                    playlist_id,
                                    playlist_order,
                                  ];
                                }
                              );
                              saveUserPlaylist(conn, user_playlists)
                                .then(() => {
                                  findItem(conn, user_playlists)
                                    .then((items) => {
                                      const user_items = items.map(
                                        ({
                                          playlist_id,
                                          playlist_order,
                                          video_id,
                                        }) => {
                                          return [
                                            user_id,
                                            playlist_id,
                                            video_id,
                                            playlist_order,
                                          ];
                                        }
                                      );
                                      saveUserItem(conn, user_items)
                                        .then(() => {
                                          const confirmURL = `${process.env.CLIENT_URL}/auth/${unique_id}/confirm_verification?token=${confirmation_token}`;
                                          mailSender(
                                            "Tethyr",
                                            config.support_email,
                                            [email],
                                            "Welcome",
                                            emailBuilder.buildWelcomeEmail()
                                          );
                                          mailSender(
                                            "Tethyr",
                                            config.support_email,
                                            [email],
                                            "Confirm",
                                            emailBuilder.buildConfirmEmail(
                                              confirmURL
                                            )
                                          );
                                          const token = jwt.sign(
                                            email,
                                            config.jwtSecret,
                                            {}
                                          );
                                          res.send({
                                            status: 200,
                                            message:
                                              "User has been registered!",
                                            user: {
                                              user_id: user_id,
                                              email: email,
                                              firstName: firstName,
                                              lastName: lastName,
                                              userName: userName,
                                              token: token,
                                              role: role_id,
                                              status: status,
                                              created_at: new Date(),
                                              updated_at: new Date(),
                                            },
                                          });
                                        })
                                        .catch((err) =>
                                          res.status(500).send(err.message)
                                        );
                                    })
                                    .catch((err) =>
                                      res.status(500).send(err.message)
                                    );
                                })
                                .catch((err) =>
                                  res.status(500).send(err.message)
                                );
                            })
                            .catch((err) => res.status(500).send(err.message));
                        })
                        .catch((err) => res.status(500).send(err.message));
                    }
                  })
                  .catch((err) => res.status(500).send(err.message));
              })
              .catch((err) => res.status(500).send(err.message));
          })
          .catch((err) => res.status(409).send(err));
      })
      .catch((err) => res.status(409).send(err));
  });
});

/**
 * Resent the confirm link
 *
 */
router.post("/resend_confirm_link", (req, res) => {
  let { user_id } = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.status(400).send({ message: "Database Connection Failed!" });
    }
    const confirmation_token = crypto.randomBytes(16).toString("hex");
    conn.query(
      `UPDATE users SET confirmation_token = '${confirmation_token}' WHERE id = '${user_id}'`,
      (err) => {
        if (err) {
          return res.status(500).send({ message: "Internal server error ..." });
        }
        conn.query(
          `SELECT email, unique_id FROM users WHERE id = '${user_id}'`,
          (err, rows) => {
            if (err) {
              return res
                .status(500)
                .send({ message: "Internal server error ..." });
            }
            const email = rows[0]["email"];
            const unique_id = rows[0]["unique_id"];
            const confirmURL = `${process.env.CLIENT_URL}/auth/${unique_id}/confirm_verification?token=${confirmation_token}`;
            mailSender(
              "Tethyr",
              config.support_email,
              [email],
              "Confirm",
              emailBuilder.buildConfirmEmail(confirmURL)
            );
            res.send({
              status: 200,
              message: "Resent the confirm link!",
            });
          }
        );
      }
    );
  });
});

/**
 * Authenticate with google
 *
 */
router.post("/socialAuth", (req, res) => {
  let { email, firstName, lastName } = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.status(400).send({ message: "Database Connection Failed!" });
    }
    const email_lowercased = email.toLowerCase();
    conn.query(
      `SELECT * FROM users WHERE email_lowercased = '${email_lowercased}'`,
      (err, rows) => {
        if (err) {
          return res.status(500).send({ message: "Internal server error ..." });
        }
        if (rows.length > 0) {
          const user = rows[0];
          if (user.status === "Unconfirmed") {
            conn.query(
              `UPDATE users SET status = 'Active', confirmed_at = NOW() WHERE id = ${user.id}`,
              (err) => {
                if (err) {
                  return res
                    .status(500)
                    .send({ message: "Internal server error ..." });
                }
                const status = "Active";
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
                    status: status,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                    subscription_id: user.subscription_id,
                  },
                });
              }
            );
          } else {
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
        } else {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(uniqid(), salt);
          const current_date = new Date();
          const status = "Active";
          const confirmation_token = crypto.randomBytes(16).toString("hex");
          const userName = firstName + "_" + lastName;
          const unique_id =
            "tethyr_" + bcrypt.hashSync(userName || uniqid(), salt);
          const role_id = 1;
          const user = [
            unique_id,
            email,
            email_lowercased,
            userName,
            hash,
            firstName,
            lastName,
            confirmation_token,
            role_id,
            status,
            current_date,
            current_date,
            current_date,
          ];
          saveUserInfo(conn, user)
            .then((user_id) => {
              findDefaultGridset(conn)
                .then((gridsets) => {
                  if (gridsets.length === 0) {
                    const confirmURL = `${process.env.CLIENT_URL}/auth/${unique_id}/confirm_verification?token=${confirmation_token}`;
                    mailSender(
                      "Tethyr",
                      config.support_email,
                      [email],
                      "Welcome",
                      emailBuilder.buildWelcomeEmail()
                    );
                    mailSender(
                      "Tethyr",
                      config.support_email,
                      [email],
                      "Confirm",
                      emailBuilder.buildConfirmEmail(confirmURL)
                    );
                    const token = jwt.sign(email, config.jwtSecret, {});
                    res.send({
                      status: 200,
                      message: "User has been registered!",
                      user: {
                        user_id: user_id,
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        userName: userName,
                        token: token,
                        status: status,
                        role: role_id,
                        created_at: current_date,
                        updated_at: current_date,
                      },
                    });
                  } else {
                    const user_gridsets = gridsets.map(
                      ({ gridset_id, gridset_order }) => {
                        return [user_id, gridset_id, gridset_order];
                      }
                    );
                    saveUserGridset(conn, user_gridsets)
                      .then(() => {
                        findPlaylist(conn, user_gridsets)
                          .then((playlists) => {
                            const user_playlists = playlists.map(
                              ({ gridset_id, playlist_id, playlist_order }) => {
                                return [
                                  user_id,
                                  gridset_id,
                                  playlist_id,
                                  playlist_order,
                                ];
                              }
                            );
                            saveUserPlaylist(conn, user_playlists)
                              .then(() => {
                                findItem(conn, user_playlists)
                                  .then((items) => {
                                    const user_items = items.map(
                                      ({
                                        playlist_id,
                                        playlist_order,
                                        video_id,
                                      }) => {
                                        return [
                                          user_id,
                                          playlist_id,
                                          video_id,
                                          playlist_order,
                                        ];
                                      }
                                    );
                                    saveUserItem(conn, user_items)
                                      .then(() => {
                                        const confirmURL = `${process.env.CLIENT_URL}/auth/${unique_id}/confirm_verification?token=${confirmation_token}`;
                                        mailSender(
                                          "Tethyr",
                                          config.support_email,
                                          [email],
                                          "Welcome",
                                          emailBuilder.buildWelcomeEmail()
                                        );
                                        mailSender(
                                          "Tethyr",
                                          config.support_email,
                                          [email],
                                          "Confirm",
                                          emailBuilder.buildConfirmEmail(
                                            confirmURL
                                          )
                                        );
                                        const token = jwt.sign(
                                          email,
                                          config.jwtSecret,
                                          {}
                                        );
                                        res.send({
                                          status: 200,
                                          message: "User has been registered!",
                                          user: {
                                            user_id: user_id,
                                            email: email,
                                            firstName: firstName,
                                            lastName: lastName,
                                            userName: userName,
                                            token: token,
                                            role: role_id,
                                            status: status,
                                            created_at: current_date,
                                            updated_at: current_date,
                                          },
                                        });
                                      })
                                      .catch((err) =>
                                        res.status(500).send(err)
                                      );
                                  })
                                  .catch((err) => res.status(500).send(err));
                              })
                              .catch((err) => res.status(500).send(err));
                          })
                          .catch((err) => res.status(500).send(err));
                      })
                      .catch((err) => res.status(500).send(err));
                  }
                })
                .catch((err) => res.status(500).send(err));
            })
            .catch((err) => res.status(500).send(err));
        }
      }
    );
  });
});

/**
 * Authenticate token => login user
 *
 */
router.post("/authenticate_token", (req, res) => {
  const email = checkToken(req);
  if (email) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send({ message: "Database Connection Failed!" });
      }
      findUserByEmailAndName(conn, email)
        .then((user) => {
          if (!user) {
            res.status(404).send({ message: "Cannot find Email address!" });
          }
          res.status(200).send({
            user: {
              user_id: user.id,
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
              userName: user.username,
              token: jwt.sign(email, config.jwtSecret, {}),
              role: user.role_id,
              status: user.status,
              created_at: user.created_at,
              updated_at: user.updated_at,
              subscription_id: user.subscription_id,
            },
          });
        })
        .catch((err) => res.status(err.status).send(err.message));
    });
  } else {
    res.status(401).send({ message: "Unauthorized request!" });
  }
});

/**
 * Confirm the User Mail
 *
 */
router.post("/confirm", (req, res) => {
  const { unique_id, token } = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.status(400).send({ message: "Database Connection Failed!" });
    }
    conn.query(
      `SELECT * FROM users WHERE unique_id = '${unique_id}' AND confirmation_token = '${token}'`,
      (err, rows) => {
        if (err) {
          return res.status(500).send({ message: "Internal server error ..." });
        }
        if (rows.length === 0) {
          return res
            .status(404)
            .send({ message: "This confirm link doesn't work!" });
        }
        const user = rows[0];
        const user_id = user.id;
        const status = "Active";
        conn.query(
          `UPDATE users SET status = 'Active', confirmed_at = NOW() WHERE id = '${user_id}'`,
          (err) => {
            if (err) {
              return res
                .status(500)
                .send({ message: "Internal server error ..." });
            }
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
                status: status,
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
});

// /**
//  * Update profile
//  *
//  */
router.post("/update_profile", (req, res) => {
  const currentEmail = checkToken(req);
  if (currentEmail) {
    const { firstName, lastName, userName, email } = req.body;
    req.getConnection((err, conn) => {
      conn.query(
        `SELECT * FROM users WHERE email_lowercased = '${currentEmail.toLowerCase()}'`,
        (err, rows) => {
          if (err) {
            return res
              .status(500)
              .send({ message: "Internal server error ..." });
          }
          const current_user = rows[0];
          const current_user_name = current_user.username;
          const confirmation_token = crypto.randomBytes(16).toString("hex");
          if (current_user_name === userName) {
            conn.query(
              `UPDATE users SET
                  first_name = '${firstName}',
                  last_name = '${lastName}',
                  email = '${email}',
                  email_lowercased = '${email.toLowerCase()}',
                  confirmation_token = CASE
                    WHEN '${currentEmail.toLowerCase()}' = '${email.toLowerCase()}' THEN confirmation_token
                    ELSE '${confirmation_token}'
                  END,
                  status = CASE
                    WHEN '${currentEmail.toLowerCase()}' = '${email.toLowerCase()}' THEN status
                    ELSE 'Unconfirmed'
                  END,
                  confirmed_at = CASE
                    WHEN '${currentEmail.toLowerCase()}' = '${email.toLowerCase()}' THEN confirmed_at
                    ELSE NULL
                  END
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
                    if (currentEmail.toLowerCase() === email.toLowerCase()) {
                      const unique_id = rows[0]["unique_id"];
                      const confirmURL = `${process.env.CLIENT_URL}/auth/${unique_id}/confirm_verification?token=${confirmation_token}`;
                      mailSender(
                        "Tethyr",
                        config.support_email,
                        [email],
                        "Confirm",
                        emailBuilder.buildConfirmEmail(confirmURL)
                      );
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
                        status: user.status,
                        subscription_id: user.subscription_id,
                      },
                    });
                  }
                );
              }
            );
          } else {
            conn.query(
              `SELECT * FROM users WHERE username = '${userName}'`,
              (err, rows) => {
                if (err) {
                  return res
                    .status(500)
                    .send({ message: "Internal server error ..." });
                }
                if (rows.length > 0) {
                  return res
                    .status(401)
                    .send({ message: "The Username already exists!" });
                }
                conn.query(
                  `UPDATE users SET
                  first_name = '${firstName}',
                  last_name = '${lastName}',
                  email = '${email}',
                  email_lowercased = '${email.toLowerCase()}',
                  confirmation_token = CASE
                    WHEN ${(currentEmail.toLowerCase() = email.toLowerCase())} THEN confirmation_token
                    ELSE '${confirmation_token}'
                  END,
                  status = CASE
                    WHEN ${(currentEmail.toLowerCase() = email.toLowerCase())} THEN status
                    ELSE 'Unconfirmed'
                  END,
                  confirmed_at = CASE
                    WHEN ${(currentEmail.toLowerCase() = email.toLowerCase())} THEN confirmed_at
                    ELSE NULL
                  END
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
                        if (
                          (currentEmail.toLowerCase() = email.toLowerCase())
                        ) {
                          const unique_id = rows[0]["unique_id"];
                          const confirmURL = `${process.env.CLIENT_URL}/auth/${unique_id}/confirm_verification?token=${confirmation_token}`;
                          mailSender(
                            "Tethyr",
                            config.support_email,
                            [email],
                            "Confirm",
                            emailBuilder.buildConfirmEmail(confirmURL)
                          );
                        }
                        const user = rows;
                        res.send({
                          status: 200,
                          user: {
                            user_id: user.id,
                            email: user.email,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            userName: user.username,
                            token: jwt.sign(user.email, config.jwtSecret, {}),
                            status: user.status,
                            subscription_id: user.subscription_id,
                          },
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        }
      );
    });
  } else {
    return res.status(401).send({ message: "Unauthorized request!" });
  }
});

/**
 * Update password
 */
router.post("/update_password", (req, res) => {
  const currentEmail = checkToken(req);
  const { new_password } = req.body;
  if (currentEmail) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(400).send({ message: "Database Connection Failed!" });
      }
      conn.query(
        `SELECT * FROM users WHERE email_lowercased = '${currentEmail.toLowerCase()}'`,
        (err, rows) => {
          if (err) {
            return res
              .status(500)
              .send({ message: "Internal server error ..." });
          }
          if (rows.length === 0) {
            return res.status(404).send({ message: "Cannot find user!" });
          }
          const user = rows[0];
          // user exists ...
          if (true) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(new_password, salt);
            const new_hashed_password = hash;
            const current_date = new Date();
            conn.query(
              `UPDATE users SET password = '${new_hashed_password}', updated_at = '${current_date}' WHERE email_lowercased = '${currentEmail.toLowerCase()}'`,
              (err, rows) => {
                if (err) {
                  return res
                    .status(500)
                    .send({ message: "Internal server error ..." });
                }
                res.send({
                  status: 200,
                  message: "User has been updated",
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
                    updated_at: current_date,
                    subscription_id: user.subscription_id,
                  },
                });
              }
            );
          } else {
            //incorrect password
            return res
              .status(401)
              .send({ message: "Password is not correct!" });
          }
        }
      );
    });
  } else {
    return res.status(401).send({ message: "Unauthorized request!" });
  }
});

/**
 * Request password reset link
 */
router.post("/forgot_password", (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).send({ message: "Email not provided!" });
  }
  req.getConnection((err, conn) => {
    if (err) {
      return res.status(400).send({ message: "Database Connection Failed!" });
    }

    conn.query(`SELECT * FROM users WHERE email = '${email}'`, (err, rows) => {
      if (err) {
        return res.status(500).send({ message: "Internal server error ..." });
      }
      if (rows.length === 0) {
        return res
          .status(404)
          .send({ message: "This is not registered user email" });
      }
      const resetToken = crypto.randomBytes(16).toString("hex");
      conn.query(
        `UPDATE users SET password_reset_token = '${resetToken}', password_reset_at = NOW() WHERE id = '${rows[0]["id"]}'`,
        (err) => {
          if (err) {
            return res
              .status(500)
              .send({ message: "Internal server error ..." });
          }
          const unique_id = rows[0]["unique_id"];
          const resetUrl = `${process.env.CLIENT_URL}/auth/${unique_id}/resetpassword/${resetToken}`;
          mailSender(
            "Tethyr",
            config.support_email,
            [email],
            "Reset Password",
            emailBuilder.buildResetPasswordEmail(resetUrl)
          );
          res
            .status(200)
            .send({ message: "Reset link has been sent to your email." });
        }
      );
    });
  });
});

/**
 * Reset password
 */
router.post("/reset_password", (req, res) => {
  const { unique_id, token, password } = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      return res.status(400).send({ message: "Database Connection Failed!" });
    }
    conn.query(
      `SELECT * FROM users WHERE unique_id = '${unique_id}' AND password_reset_token = '${token}'`,
      (err, rows) => {
        if (err) {
          return res.status(500).send({ message: "Internal server error ..." });
        }
        if (rows.length === 0) {
          return res.status(401).send({ message: "Unauthorized request!" });
        }
        const password_reset_at = rows[0]["password_reset_at"];
        const differenceInSeconds =
          (new Date().getTime - new Date(password_reset_at).getTime) / 1000;
        if (differenceInSeconds > config.password_reset_expiration) {
          return res
            .status(401)
            .send({ message: "Your link has expired, please request again." });
        } else {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(password, salt);
          const new_hashed_password = hash;
          conn.query(
            `UPDATE users SET password = '${new_hashed_password}', updated_at = NOW() WHERE unique_id = '${unique_id}'`,
            (err) => {
              if (err) {
                return res
                  .status(500)
                  .send({ message: "Internal server error ..." });
              }
              res.status(200).send({ message: "Password has been updated!" });
            }
          );
        }
      }
    );
  });
});

router.use("/external_accounts", externalAccounts);

module.exports = router;
