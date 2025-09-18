var express = require("express");
var router = express.Router();
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");

router.get("/register", registerController.ShowRegisterPage);
router.post("/register", registerController.RegisterUser);

router.get("/login", loginController.ShowLoginPage);
router.post("/login", loginController.LoginUser);

module.exports = router;