const Ajv = require("ajv");
const ajv = new Ajv();

const farmSchemaCheck = (data) => {
  const schema = {
    type: "array",
    items: {
      type: "object",
      properties: {
        farmer_id: {},
        name: {},
        address: {},
        pin: {},
        location: {},
        farm_size: {},
        rating: {},
        farm_pdf: {},
        farm_practice_pdf: {},
        farm_practice_rating: {},
        image_url: {},
        video_url: {},
        food_grains: {},
        vegetables: {},
        horticulture: {},
        floriculture: {},
        exotic_crops: {},
      },
      additionalProperties: false,
    },
  };

  const validate = ajv.compile(schema);

  const isValid = validate(data);
  return isValid;
};
module.exports = farmSchemaCheck;
