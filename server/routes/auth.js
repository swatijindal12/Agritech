const express = require('express');
const router = express.Router();

// Importing controllers
const {loginUser,verifyUser} = require('../controllers/authController');

// Route => api/v1/auth
router.route('/login').post(loginUser);
router.route('/verify').post(verifyUser);


module.exports = router;