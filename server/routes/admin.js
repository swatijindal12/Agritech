const express = require("express");
const router = express.Router();

// Importing controllers
const {
  validateData,
  createFarm,
  createFarmer,
  getFarmers,
  createCustomer,
  getFarms,
  getCustomers,
  getdashBoard,
  getAgreementsForAdmin,
  closeAgreement,
} = require("../controllers/adminController");

// Importing middleware to check authentication of routes
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Route => /api/v1/admin

// Validate the file Data
router
  .route("/validate-data")
  .post(isAuthenticatedUser, authorizeRoles("admin"), validateData);

// Insert farm data into DB.
router.route("/farm").post(createFarm);

// Get List of farms
router
  .route("/farms")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getFarms);

// Get all agreement of all the customer
router
  .route("/agreement")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAgreementsForAdmin);

// Close particular agreement of customer
router
  .route("/agreement/closed/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), closeAgreement);

// Insert farmer data into DB.
router
  .route("/farmer")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createFarmer);

// Get List of farmers
router
  .route("/farmers")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getFarmers);

// Insert customer data into DB.
router
  .route("/customer")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createCustomer);

// Get List of customers
router
  .route("/customers")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getCustomers);

// Get the data for Dashboard
router
  .route("/dashboard")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getdashBoard);

module.exports = router;
