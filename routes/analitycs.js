const express = require('express');
const controller = require('../controllers/analitics');
const router = express.Router();


// localhost:5000/api/analitycs/overview
// localhost:5000/api/analitycs/analitics

router.get('/overview', controller.overview)
router.get('/analitics', controller.analitics)

module.exports = router;