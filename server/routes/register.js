const express = require('express');
const router = express.Router();

// Importing controllers
const {createUser} = require('../controllers/createUserController');
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth')

// Route => api/v1/register
router.route('/user').post(isAuthenticatedUser, authorizeRoles('Company'), createUser);

module.exports = router;