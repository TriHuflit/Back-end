const express = require("express");
const router = express.Router();
const auth = require("../controllers/AuthController");
const authorize = require("../middleware/authorize");
router.post("/register", auth.register);

router.post("/token", auth.token);

router.get("/verifyEmail/:id", auth.verifyEmail);

router.post("/user/login", auth.userLogin);

router.post("/logout/:id", auth.logout);

router.post("/login", auth.login);

module.exports = router;
