const express = require('express');
const passport = require('passport');
const controller = require('../controllers/analytics');
const router = express.Router();


// localhost:5001/api/analytics/overview
// localhost:5001/api/analytics/analytics

router.get('/overview', passport.authenticate('jwt', {session: false}), controller.overview)
router.get('/analytics', passport.authenticate('jwt', {session: false}), controller.analytics)
console.log('router ++');

module.exports = router;