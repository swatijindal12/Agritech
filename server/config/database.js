const mongoose = require("mongoose");
const { logger } = require("../utils/logger");
const { errorLog } = require("../utils/commonError");

// Import the User model
const User = require("../models/users");

// Delete unverified users older than a specified time
const deleteUnverifiedUsers = async () => {
  const timeThreshold = new Date(Date.now() - 1 * 120 * 1000); // 1 minute ago
  const result = await User.deleteMany({
    is_verified: false,
    created_at: { $lte: timeThreshold },
  });
};

//Delete after 2 min
setInterval(deleteUnverifiedUsers, 120 * 1000); // 2 minute

// Connection using mongoose string
/*const connectDatabase = () => {
  if (process.env.NODE_ENV == "production ") {
    mongoose
      .connect(process.env.DB_PROD_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((con) => {
        logger.log(
          "info",
          `MongoDB Database connected with host ${con.connection.host}`
        );
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
};*/
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_PROD_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      logger.log(
        "info",
        `MongoDB Database connected with host ${con.connection.host}`
      );
      console.log(
        `MongoDB Database connected with host ${con.connection.host}`
      );
    })
    .catch((err) => consolg.log("error: ", err));
};

// To remove Deprecation Warning
mongoose.set("strictQuery", true);

// Exporting
module.exports = connectDatabase;
