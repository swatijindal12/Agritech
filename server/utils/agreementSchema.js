const Ajv = require("ajv");
const ajv = new Ajv();

const agreementSchemaCheck = async (data) => {
  const schema = {
    type: "object",
    properties: {
      name: {},
      address: {},
      pin: {},
      phone: {},
      email: {},
      image_url: {},
      rating: {},
      education: {},
      farmer_pdf: {},
    },
  };

  const validate = ajv.compile(schema);

  const isValid = validate(data);
  return isValid;
};
module.exports = agreementSchemaCheck;
