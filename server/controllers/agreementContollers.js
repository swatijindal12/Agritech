const agreementServices = require("../services/agreement");
const { logger } = require("../utils/logger");
const { errorLog } = require("../utils/commonError");
// Route to      => api/v1/agreement
exports.createAgreement = async (req, res, next) => {
  agreementServices
    .createAgreement(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      errorLog(req, error);
      res.status(400).json({
        error: `failed operation controller ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
  next();
};

// Route to      => api/v1/agreements
exports.getAgreements = async (req, res, next) => {
  agreementServices
    .getAgreements(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      errorLog(req, error);
      res.status(400).json({
        error: "failed operation",
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
  next();
};

exports.getFarmById = async (req, res, next) => {
  agreementServices
    .getFarmById(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      errorLog(req, error);
      res.status(400).json({
        error: "failed operation",
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
  next();
};

exports.getAgreementsOfCustomer = (req, res, next) => {
  agreementServices
    .getAgreementsOfCustomer(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      errorLog(req, error);
      res.status(400).json({
        error: "failed operation",
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
  next();
};

// Route to      => api/v1/agreement/buy/:id
exports.buyAgreement = (req, res, next) => {
  agreementServices
    .buyAgreement(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      errorLog(req, error);
      res.status(400).json({
        error: "failed operation",
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
  next();
};

// Route to      => api/v1/cart
exports.addToCart = (req, res, next) => {
  agreementServices
    .addToCart(req)
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
  next();
};

exports.removeFromCart = (req, res, next) => {
  agreementServices
    .removeFromCart(req)
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
  next();
};

exports.getCart = (req, res, next) => {
  agreementServices
    .getCart(req)
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
  next();
};
