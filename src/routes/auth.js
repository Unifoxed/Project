var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");

router.get("/register", authController.ShowRegisterPage);
router.get("/login", authController.ShowLoginPage);

router.post("/register", authController.RegisterUser);
router.post("/login", authController.LoginUser);

module.exports = router;