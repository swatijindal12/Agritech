const express = require("express");
const router = express.Router();

// Importing controllers
const {
  createAgreement,
  getAgreements,
  buyAgreement,
} = require("../controllers/agreementContollers");

// Importing middleware to check authentication of routes
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Route => /api/v1/agreement

// Create agreement (ready for sale)
router
  .route("/agreement")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createAgreement);

// Route => /api/v1/agreements

// get agreements list
router
  .route("/agreements")
  .get(isAuthenticatedUser, authorizeRoles("admin", "customer"), getAgreements);

// Route => /api/v1/agreement/bud/:id

// get agreements list (buy)
router
  .route("/agreement/buy/:id")
  .post(isAuthenticatedUser, authorizeRoles("admin", "customer"), buyAgreement);

module.exports = router;
