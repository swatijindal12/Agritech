const { logger } = require("../utils/logger");

exports.preRequestLogger = (req, res, next) => {
  console.log("preRequestLogger => ", req.body);
  const body = { ...req.body };

  // if there is password
  if (body.password) {
    body.password = "*********";
  }
  const data = {
    route: req.client.parser.incoming.originalUrl,
    headers: req.headers,
    body: body,
    params: req.params,
    query: req.query,
  };
  logger.info(`Request -> ${JSON.stringify(data)}`);
  next();
};

exports.postRequestLogger = (req, res, next) => {
  console.log("postRequestLogger => ", req.body);
  const body = { ...req.body };

  // if there is password
  if (body.password) {
    body.password = "*********";
  }

  const data = {
    route: req.client.originalUrl,
    headers: req.headers,
    body: body,
    params: req.params,
    query: req.query,
    response: res.data,
  };
  logger.info(`Response -> ${JSON.stringify(data)}`);
};
