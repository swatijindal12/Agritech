const csv = require("csvtojson");

const csvToJson = async (file) => {
  const jsonArray = await csv().fromString(file.data.toString());
  return jsonArray;
};
module.exports = csvToJson;
