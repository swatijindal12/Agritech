const express = require("express");
const router = express.Router();

// Importing controllers for agreements
const {
  createAgreement,
  getAgreements,
  addToCart,
  removeFromCart,
  getCart,
  getFarmById,
  getAgreementsOfCustomer,
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
//isAuthenticatedUser, authorizeRoles("admin", "customer"),

// Route => /api/v1/marketplace/farm/:id ,  comes from agreements of marketplace.
router
  .route("/farm/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin", "customer"), getFarmById);

// Get all Agreements of the User.
router
  .route("/agreement")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin", "customer"),
    getAgreementsOfCustomer
  );
//isAuthenticatedUser, authorizeRoles("admin", "customer"),

// Route => /api/v1/marketplace/agreements
// Get agreements list for MarketPlaces Admin as well as Customer
router
  .route("/agreements")
  .get(isAuthenticatedUser, authorizeRoles("admin", "customer"), getAgreements);

// Route => /api/v1/marketplace/key
// Key for razorpay
router
  .route("/key")
  .get(isAuthenticatedUser, authorizeRoles("admin", "customer"), getKeyId);

// Route => /api/v1/marketplace/checkout
// Create Order RazorPay
router
  .route("/checkout")
  .post(isAuthenticatedUser, authorizeRoles("admin", "customer"), createOrder);

// Route => /api/v1/marketplace/paymentVerification
// Payment Verification RazorPay
router
  .route("/paymentverification")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin", "customer"),
    paymentVerification
  );

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
