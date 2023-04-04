const express = require("express");
const app = express();

// Importing to read file
const fileupload = require("express-fileupload");

// Importing External Package.
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Importing environment setup file.
require("dotenv").config({ path: "./config/config.env" });

// Importing database.
const connectDatabase = require("./config/database");

// Connecting to databse.
connectDatabase();

// Middleware for express-fileupload
app.use(fileupload());

// Importing all routes.
const auth = require("./routes/auth");

// Scope change new routes
const adminRoutes = require("./routes/admin");

const agreementRoutes = require("./routes/agreement");

// Setup CORS - accessible by other domains
app.use(cors());

// Set cookie parser
app.use(cookieParser());

// Setup body parser
app.use(express.json());

// Routing request to => {BASE_URL}/api/v1/auth to authenticate User.
app.use("/api/v1/auth", auth);

//---- SCOPE CHANGE ----- //
app.use("/api/v1/admin", adminRoutes);

// Agreement
app.use("/api/v1/marketplace", agreementRoutes);

// Handling unhandled routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: null,
    httpStatus: 404,
    data: null,
  });
});

// Port on which Server run
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
