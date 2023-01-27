const agreementServices = require("../services/agreement");

// Route to      => api/v1/agreement

exports.createAgreement = async (req, res, next) => {
  console.log("Inside create Agreement controller");
  agreementServices
    .createAgreement(req)
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

// Route to      => api/v1/agreements

exports.getAgreements = async (req, res, next) => {
  console.log("Inside get agreement controllers");
  agreementServices
    .getAgreements(req)
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

// Route to      => api/v1/agreement/buy/:id
exports.buyAgreement = (req, res, next) => {
  console.log("Inside get buyAgreement controllers");
  agreementServices
    .buyAgreement(req)
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

// Route to      => api/v1/cart
exports.addToCart = (req, res, next) => {
  console.log("Inside AddToCart Controllers");
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
};

exports.removeFromCart = (req, res, next) => {
  console.log("Inside removeCart Controllers");
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
};

exports.getCart = (req, res, next) => {
  console.log("Inside getCart Controllers");
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
};
