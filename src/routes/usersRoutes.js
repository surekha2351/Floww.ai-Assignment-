const express = require("express");
const router = express.Router();
const userControllers = require("../Controllers/userControllers");

router.post("/register", userControllers.register);

router.post("/login", userControllers.loginUser);

module.exports = router;
