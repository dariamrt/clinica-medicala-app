const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/current-user", authController.getCurrentUser);

module.exports = router;
