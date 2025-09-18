var express = require("express");

function ShowRegisterPage(req, res, next) {
    res.render("register");
}
module.exports = { ShowRegisterPage };