const paymentServices = require("../services/payment");
const { logger } = require("../utils/logger");
const { errorLog } = require("../utils/commonError");

exports.getKeyId = async (req, res, next) => {
  paymentServices
    .getKeyId(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      errorLog(req, error);
      res.status(400).json({
        error: `failed operation 2 ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
  next();
};
// Route to      => api/v1/agreement
exports.createOrder = async (req, res, next) => {
  paymentServices
    .createOrder(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      errorLog(req, error);
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
  next();
};

exports.paymentVerification = async (req, res, next) => {
  paymentServices
    .paymentVerification(req)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      errorLog(req, error);
      res.status(400).json({
        error: `failed operation ${error}`,
        message: null,
        httpStatus: 400,
        data: null,
      });
    });
  next();
};
