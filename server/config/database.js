const mongoose = require("mongoose");

// Connection using mongoose string
const connectDatabase = () => {
  if (process.env.NODE_ENV == "production ") {
    mongoose
      .connect(process.env.DB_PROD_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((con) => {
        console.log(
          `MongoDB Database connected with host ${con.connection.host}`
        );
      });
  } else {
    mongoose
      .connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((con) => {
        console.log(
          `MongoDB Database connected with host ${con.connection.host}`
        );
      });
  }
};

// To remove Deprecation Warning
mongoose.set("strictQuery", true);

// Exporting
module.exports = connectDatabase;
