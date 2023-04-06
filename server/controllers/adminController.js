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
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to      => api/v1/admin/state : POST
// create data in stage table
exports.stagedAgreements = async (req, res, next) => {
  adminService
    .stagedAgreements(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to      => api/v1/admin/stage :: GET
// get staged data
exports.getStagedAgreements = async (req, res, next) => {
  adminService
    .getStagedAgreements(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

exports.deleteAgreements = async (req, res, next) => {
  adminService
    .deleteAgreement(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

exports.updateAgreement = async (req, res, next) => {
  adminService
    .updateAgreement(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// List of agreements for admin edit/delete
exports.listAgreements = async (req, res, next) => {
  adminService
    .listAgreements(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to      => api/v1/admin/validate/farmer :: POST
// Validate the Json data in table
exports.validateFarmers = async (req, res, next) => {
  adminService
    .validateFarmers(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to      => api/v1/admin/stage : POST
// create data in stage table
exports.stagedFarmers = async (req, res, next) => {
  adminService
    .stagedFarmers(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to      => api/v1/admin/stage :: GET
// get staged data
exports.getStagedFarmers = async (req, res, next) => {
  adminService
    .getStagedFarmers(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to     => POST: api/v1/admin/farmer
// Create farmer
exports.createFarmer = async (req, res, next) => {
  adminService
    .createFarmer(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to     => UPDATE: api/v1/admin/farmer/:id
// Create farmer
exports.updateFarmer = async (req, res, next) => {
  adminService
    .updateFarmer(req)
    .then((response) => {
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

// Route to     => DELETE: api/v1/admin/farmer/:id
// Create farmer
exports.deleteFarmer = async (req, res, next) => {
  adminService
    .deleteFarmer(req)
    .then((response) => {
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

// Route to      => api/v1/admin/validate/farm :: POST
// Validate the Json data in table
exports.validateFarms = async (req, res, next) => {
  adminService
    .validateFarms(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to      => api/v1/admin/farm/stage : POST
// create data in stage table
exports.stagedFarms = async (req, res, next) => {
  adminService
    .stagedFarms(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to      => api/v1/admin/farm/stage :: GET
// get staged data
exports.getStagedFarms = async (req, res, next) => {
  adminService
    .getStagedFarms(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to      => POST: api/v1/admin/farm
// Create farm
exports.createFarm = async (req, res, next) => {
  adminService
    .createFarm(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation  ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to     => UPDATE: api/v1/admin/farm/:id
// update farm
exports.updateFarm = async (req, res, next) => {
  adminService
    .updateFarm(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};

// Route to     => DELETE: api/v1/admin/farm/:id
// delete farm
exports.deleteFarm = async (req, res, next) => {
  adminService
    .deleteFarm(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
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
        error: `failed operation ${error}`,
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

// Route to     => api/v1/admin/ageeement
// Give all the agreement active and close
exports.getAgreementsForAdmin = async (req, res, next) => {
  adminService
    .getAgreementsForAdmin(req)
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

// Route to     => api/v1/admin/agreement/closed/:id
// Give all the agreement active and close
exports.closeAgreement = async (req, res, next) => {
  adminService
    .closeAgreement(req)
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

// Route to => api/v1/admin/audit/:table

exports.getAudit = async (req, res, next) => {
  adminService
    .getAudit(req)
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

// Route to => api/v1/admin/order
exports.getOrder = async (req, res, next) => {
  adminService
    .getOrder(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
};
