const express = require("express");
const router = express.Router();

// Importing controllers
const {
  createAgreement,
  getAgreements,
  buyAgreement,
  addToCart,
  removeFromCart,
  getCart,
} = require("../controllers/agreementContollers");

// Importing middleware to check authentication of routes
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Route => /api/v1/agreement

// Create agreement (ready for sale)
router.route("/agreement").post(createAgreement);

// Route => /api/v1/marketplace/agreements

// Get agreements list for MarketPlaces
router
  .route("/agreements")
  .get(isAuthenticatedUser, authorizeRoles("admin", "customer"), getAgreements);

// Route => /api/v1/marketplace/cart
// Add to cart
router
  .route("/cart")
  .post(isAuthenticatedUser, authorizeRoles("admin", "customer"), addToCart);

// Route => /api/v1/marketplace/cart
// Get cart
router
  .route("/cart")
  .get(isAuthenticatedUser, authorizeRoles("admin", "customer"), getCart);

// Route => /api/v1/marketplace/remove
// Remove cart
router
  .route("/remove")
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin", "customer"),
    removeFromCart
  );

// Route => /api/v1/agreement/bud/:id

// router
//   .route("/agreements/:id")
//   .get(isAuthenticatedUser, authorizeRoles("customer"), getAgreementsByID);

// get agreements list (buy)
// router
//   .route("/agreement/buy/:id")
//   .post(isAuthenticatedUser, authorizeRoles("admin", "customer"), buyAgreement);

module.exports = router;
