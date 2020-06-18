const express = require('express');
const controller = require('../controllers/auth');
const router = express.Router();


// localhost:5000/api/auth/login
// localhost:5000/api/auth/register
console.log('router works/////////');
router.post('/login', controller.login)
router.post('/register', controller.register)

module.exports = router;