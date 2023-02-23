const csv = require("csvtojson");

const csvToJson = async (file) => {
  const jsonArray = await csv().fromString(file.data.toString());
  // console.log("JsonArray :- ", jsonArray);
  return jsonArray;
};
module.exports = csvToJson;
