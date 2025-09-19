var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");

router.get("/register", authController.ShowRegisterPage);
router.get("/login", authController.ShowLoginPage);

router.post("/register", authController.RegisterUser);
router.post("/login", authController.LoginUser);
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
        return res.status(500).send("Error logging out.");
    }
    res.redirect("/"); // Redirect to home page after logout
    });
});

module.exports = router;