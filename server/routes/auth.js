const express = require("express");
const router = express.Router();

// Importing controllers
const {
  loginUser,
  verifyUser,
  logoutUser,
  createUser,
  verifyCreateUser,
} = require("../controllers/authController");

// Importing middleware
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Route => api/v1/auth
router.route("/login").post(loginUser);
router.route("/verify").post(verifyUser);
router.route("/register").post(createUser);
router.route("/verify-register").post(verifyCreateUser);
router.route("/logout").post(isAuthenticatedUser, logoutUser);

module.exports = router;
