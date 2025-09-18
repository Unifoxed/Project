var express = require("express");

function ShowLoginPage(req, res, next) {
    res.render("login");
}
module.exports = { ShowLoginPage };