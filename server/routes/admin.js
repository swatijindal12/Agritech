const express = require("express");
const router = express.Router();

// Importing controllers
const {
  validateData,
  createFarm,
  stagedFarms,
  getStagedFarms,
  validateFarms,
  createFarmer,
  updateFarmer,
  deleteFarmer,
  getFarmers,
  validateFarmers,
  stagedFarmers,
  getStagedFarmers,
  deleteStaged,
  createCustomer,
  deleteFarm,
  updateFarm,
  getFarms,
  getCustomers,
  getdashBoard,
  getAgreementsForAdmin,
  closeAgreement,
  stagedAgreements,
  getStagedAgreements,
  deleteAgreements,
  listAgreements,
  updateAgreement,
  getAudit,
  getOrder,
} = require("../controllers/adminController");

// Importing middleware to check authentication of routes
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Route => /api/v1/admin

// Validate the file Data
router
  .route("/validate-data")
  .post(isAuthenticatedUser, authorizeRoles("admin"), validateData);

// Stage the data before approval :: POST
router
  .route("/stage")
  .post(isAuthenticatedUser, authorizeRoles("admin"), stagedAgreements);

// Get Staged data before approval :: get
router
  .route("/stage")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getStagedAgreements);

// Delete agreement which are not active
router
  .route("/agreement/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteAgreements);

// update agreement which are not active
router
  .route("/agreement/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateAgreement);

// Get List of Agreement for Admin to edit,delete
router
  .route("/listagreements")
  .get(isAuthenticatedUser, authorizeRoles("admin"), listAgreements);

// Insert farm data into DB.
router
  .route("/farm")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createFarm);

// Validate farm.
router
  .route("/farm/validate")
  .post(isAuthenticatedUser, authorizeRoles("admin"), validateFarms);

// Insert farm data into Stage DB.
router
  .route("/farm/stage")
  .post(isAuthenticatedUser, authorizeRoles("admin"), stagedFarms);

// Get farm data from stage Table.
router
  .route("/farm/stage")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getStagedFarms);

// Delete farm data into DB.
router
  .route("/farm/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteFarm);

// Update farm data into DB.
router
  .route("/farm/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateFarm);

// Get List of farms
router
  .route("/farms")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getFarms);

// Get all agreement of customer
router
  .route("/agreement")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAgreementsForAdmin);

// Close particular agreement of customer
router
  .route("/agreement/closed/:id")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin", "customer"),
    closeAgreement
  );

// Insert farmer data into DB.
router
  .route("/farmer")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createFarmer);

// Validate Farmer.
router
  .route("/farmer/validate")
  .post(isAuthenticatedUser, authorizeRoles("admin"), validateFarmers);

// Insert farmer data into Stage DB.
router
  .route("/farmer/stage")
  .post(isAuthenticatedUser, authorizeRoles("admin"), stagedFarmers);

// Delete stagefarmer data from Stage DB.
router
  .route("/stage/:file/:type")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteStaged);

// Get farmer data into stage Table.
router
  .route("/farmer/stage")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getStagedFarmers);

// Insert farmer data into DB.
router
  .route("/farmer/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateFarmer);

// Delete farmer data into DB.
router
  .route("/farmer/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteFarmer);

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

// Get audit
router
  .route("/audit/:table")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAudit);

// Get Order List
router
  .route("/order")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getOrder);

module.exports = router;
