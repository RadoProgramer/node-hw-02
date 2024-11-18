const express = require("express");
const register = require("../../controllers/users/register");
const login = require("../../controllers/users/login");
const logout = require("../../controllers/users/logout");
const current = require("../../controllers/users/current");
const auth = require("../../middleware/auth");

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.get("/logout", auth, logout);
router.get("/current", auth, current);

module.exports = router;
