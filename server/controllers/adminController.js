const adminService = require("../services/admin");

// Route to      => api/v1/admin/validate-data
// Validate the Json data in table
exports.validateData = async (req, res, next) => {
  adminService
    .validate(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: "failed operation",
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to     => POST: api/v1/admin/farmer
// Create farmer
exports.createFarmer = async (req, res, next) => {
  console.log("createFarmer Controllers : ");
  adminService
    .createFarmer(req)
    .then((response) => {
      console.log("res controller :- ", response);
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation 2 ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to      => POST: api/v1/admin/farm
// Create farm
exports.createFarm = async (req, res, next) => {
  console.log("Inside createFarm controllers.");
  adminService
    .createFarm(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation controllers ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

exports.getFarms = async (req, res, next) => {
  adminService
    .getFarms(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: "failed operation",
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to     => GET: api/v1/admin/farmers
// Get the List of farmers
exports.getFarmers = async (req, res, next) => {
  adminService
    .getFarmers(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: "failed operation",
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to     => api/v1/admin/company
// Create company
exports.createCustomer = async (req, res, next) => {
  adminService
    .createCustomer(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: "failed operation",
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to     => api/v1/admin/customers
exports.getCustomers = async (req, res, next) => {
  adminService
    .getCustomers(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: "failed operation",
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to     => api/v1/admin/dashboard
exports.getdashBoard = async (req, res, next) => {
  adminService
    .getdashBoard(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: "failed operation",
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};
