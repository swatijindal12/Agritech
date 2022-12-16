"use strict";
const express = require('express');
const router = express.Router();
// Importing logic controllers
const { setup } = require('../controllers/authController');
// Route => api/v1/test
router.route('/test').get(setup);
module.exports = router;
