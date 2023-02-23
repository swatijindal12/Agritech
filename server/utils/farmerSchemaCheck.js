const Ajv = require("ajv");
const ajv = new Ajv();

const farmerSchemaCheck = (data) => {
  console.log("inside farmerSchemaCheck 1.");
  const schema = {
    type: "array",
    items: {
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
      additionalProperties: false,
    },
  };

  const validate = ajv.compile(schema);

  const isValid = validate(data);
  return isValid;
};

module.exports = { farmerSchemaCheck };
