const express = require("express");
const router = express.Router();

// Importing controllers
const {
  createUser,
  verifyCreateUser,
  loginUser,
  verifyUser,
  logoutUser,
} = require("../controllers/authController");

// Importing middleware
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Route => api/v1/auth
router.route("/register").post(createUser);
router.route("/verify-register").post(verifyCreateUser);
router.route("/login").post(loginUser);
router.route("/verify").post(verifyUser);
router.route("/logout").post(isAuthenticatedUser, logoutUser);

module.exports = router;
