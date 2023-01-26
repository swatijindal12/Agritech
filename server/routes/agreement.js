const express = require("express");
const router = express.Router();

// Importing controllers for agreements
const {
  createAgreement,
  getAgreements,
  addToCart,
  removeFromCart,
  getCart,
} = require("../controllers/agreementContollers");

// Importing controllers for payment
const {
  createOrder,
  paymentVerification,
  getKeyId,
} = require("../controllers/paymentController");

// Importing middleware to check authentication of routes
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Route => /api/v1/marketplace/agreement
// Create agreement (ready for sale)
router.route("/agreement").post(createAgreement);

// Route => /api/v1/marketplace/agreements
// Get agreements list for MarketPlaces
router
  .route("/agreements")
  .get(isAuthenticatedUser, authorizeRoles("admin", "customer"), getAgreements);

// Route => /api/v1/marketplace/key
// Key for razorpay
router
  .route("/key")
  .get(isAuthenticatedUser, authorizeRoles("customer"), getKeyId);

// Route => /api/v1/marketplace/checkout
// Create Order RazorPay
router
  .route("/checkout")
  .post(isAuthenticatedUser, authorizeRoles("customer"), createOrder);

// Route => /api/v1/marketplace/paymentVerification
// Payment Verification RazorPay
router
  .route("/paymentverification")
  .post(isAuthenticatedUser, authorizeRoles("customer"), paymentVerification);

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

module.exports = router;
