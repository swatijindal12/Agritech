const express = require('express');
const router = express.Router();

// Importing controllers
const {addFarm} = require('../controllers/addFarmController');

// Importing auth middleware
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth')

// Route => api/v1/farmer
router.route('/farm').post(isAuthenticatedUser, authorizeRoles('Farmer'), addFarm)
// router.route('/test', tesContr)

module.exports = router;