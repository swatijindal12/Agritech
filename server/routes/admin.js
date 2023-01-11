const express = require('express');
const router = express.Router();

// Importing controllers
const {validateData,createFarm,createFarmer,getFarmers,createCustomer} = require('../controllers/adminController');

// Importing middleware to check authentication of routes
const {isAuthenticatedUser,authorizeRoles} = require('../middlewares/auth')

// Route => /api/v1/admin 

// Validate the file Data
router.route('/validate-data').post(isAuthenticatedUser,authorizeRoles('admin'),validateData);

// Insert farm data into DB.
router.route('/farm').post(createFarm);

// Get List of farms 
// router.route('/farms').get(getFarms); //Working today

// Insert farmer data into DB.
router.route('/farmer').post(isAuthenticatedUser,authorizeRoles('admin'),createFarmer);

// Get List of farmers 
router.route('/farmers').get(isAuthenticatedUser,authorizeRoles('admin'), getFarmers);

// Insert company data into DB.
router.route('/customer').post(isAuthenticatedUser,authorizeRoles('admin'),createCustomer);

module.exports = router;

// /api/v1/farms get all farms