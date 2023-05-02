const { logger, errorLogger } = require("./logger");

async function errorLog(req, error) {
  const body = { ...req.body };

  if (body.password) {
    body.password = "*********";
  }
  const data = {
    route: req.client.originalUrl,
    headers: req.headers,
    body: body,
    params: req.params,
    query: req.query,
  };

  errorLogger.error(`Error -> ${JSON.stringify(data)} -> { error : ${error} }`);
}

module.exports = {
  errorLog,
};
