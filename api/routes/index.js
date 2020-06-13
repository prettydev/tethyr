var express = require("express");
var router = express.Router();

const Auth_admin = require("./admin/auth");
const Video_admin = require("./admin/video");
const Playlist_admin = require("./admin/playlist");
const Gridset_admin = require("./admin/gridset");
const Platform_admin = require("./admin/platform");
const UserGridset_admin = require("./admin/usergridset");
const User_admin = require("./admin/user");
const Vanguard = require("./admin/vanguard");

const Auth_user = require("./user/auth");
const Video_user = require("./user/video");
const Playlist_user = require("./user/playlist");
const Gridset_user = require("./user/gridset");
const Cube_user = require("./user/cube");
const UserGridset_user = require("./user/usergridset");
const Social_user = require("./user/social");
const User_user = require("./user/user");

router.use("/admin/auth", Auth_admin);
router.use("/admin/video", Video_admin);
router.use("/admin/playlist", Playlist_admin);
router.use("/admin/gridset", Gridset_admin);
router.use("/admin/platform", Platform_admin);
router.use("/admin/usergridset", UserGridset_admin);
router.use("/admin/user", User_admin);
router.use("/admin/vanguard", Vanguard);

router.use("/user/auth", Auth_user);
router.use("/user/video", Video_user);
router.use("/user/playlist", Playlist_user);
router.use("/user/gridset", Gridset_user);
router.use("/user/cube", Cube_user);
router.use("/user/usergridset", UserGridset_user);
router.use("/user/social", Social_user);
router.use("/user/user", User_user);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Tethyr" });
});

module.exports = router;