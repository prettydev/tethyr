const express = require("express");
const router = express.Router();

const user = require("./user");
const item = require("./item");
const userplaylist = require("./userPlaylist");
const gridset = require("./gridset");
const cube = require("./cube");
const usergridset = require("./usergridset");
const useritem = require("./userItem");
const social = require("./social");
const ads = require("./ads");
const chargebee = require("./chargebee");

router.use("/user", user);
router.use("/item", item);
router.use("/userPlaylist", userplaylist);
router.use("/gridset", gridset);
router.use("/cube", cube);
router.use("/userGridset", usergridset);
router.use("/social", social);
router.use("/userItem", useritem);
router.use("/ads", ads);
router.use("/chargebee", chargebee);

router.get("/", function (req, res) {
  res.render("index", { title: "Api" });
});

module.exports = router;
