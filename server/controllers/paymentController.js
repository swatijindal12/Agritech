const paymentServices = require("../services/payment");

exports.getKeyId = async (req, res, next) => {
  console.log("Inside create Order controller");
  paymentServices
    .getKeyId(req)
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
// Route to      => api/v1/agreement
exports.createOrder = async (req, res, next) => {
  console.log("Inside create Order controller");
  paymentServices
    .createOrder(req)
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

exports.paymentVerification = async (req, res, next) => {
  console.log("Inside create Order controller");
  paymentServices
    .paymentVerification(req)
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
