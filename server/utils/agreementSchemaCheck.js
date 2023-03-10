const Ajv = require("ajv");
const ajv = new Ajv();

const agreementSchemaCheck = async (data) => {
  const schema = {
    type: "array",
    items: {
      type: "object",
      properties: {
        farmer_name: {},
        crop: {},
        start_date: {},
        end_date: {},
        area: {},
        price: {},
        farm_id: {},
        farm_nft_id: {},
        address: {},
      },
      additionalProperties: false,
    },
  };

  const validate = ajv.compile(schema);

  const isValid = validate(data);
  return isValid; // return true or false
};
module.exports = agreementSchemaCheck;
