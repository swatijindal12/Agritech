const mongoose = require("mongoose");

// Define a custom schema type for dates
const customDateType = {
  type: Date,
  get: function (val) {
    // Convert the ISOString to a custom format
    return val ? new Date(val).toLocaleString() : null;
  },
  set: function (val) {
    // Convert the custom format to an ISOString
    return val ? new Date(val).toISOString() : null;
  },
};

module.exports = customDateType;
