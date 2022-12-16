"use strict";
const express = require('express');
const app = express();
// Importing External Package.
const cors = require('cors');
// Importing environment setup file.
require("dotenv").config({ path: './config/config.env' });
// Importing database.
const connectDatabase = require('./config/database');
// Connecting to databse.
connectDatabase();
// Importing all routes.
const auth = require('./routes/auth');
// Setup CORS - accessible by other domains
app.use(cors());
// Setup body parser
app.use(express.json());
// Routing request to => {BASE_URL}/api/v1/
app.use('/api/v1', auth);
// Port on which Server run
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});
