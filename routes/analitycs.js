const express = require('express');
const passport = require('passport');
const controller = require('../controllers/analitics');
const router = express.Router();


// localhost:5000/api/analitycs/overview
// localhost:5000/api/analitycs/analitics

router.get('/overview', passport.authenticate('jwt', {session: false}), controller.overview)
router.get('/analitics', passport.authenticate('jwt', {session: false}), controller.analitics)

module.exports = router;