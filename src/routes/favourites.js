var express = require('express');
var router = express.Router();
const favouritesController = require('../controllers/favouritesController');

router.get('/', favouritesController.GetFavourites);
module.exports = router;
