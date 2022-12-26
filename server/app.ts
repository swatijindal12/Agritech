import express from "express";
const app = express();

// Importing External Package.
const cors = require('cors');
const cookieParser = require('cookie-parser')

// Importing environment setup file.
require("dotenv").config({ path: './config/config.env' });

// Importing database.
const connectDatabase = require('./config/database');

// Connecting to databse.
connectDatabase();

// Importing all routes.
const auth = require('./routes/auth');
const register = require('./routes/register');

// Setup CORS - accessible by other domains
app.use(cors());

// Set cookie parser
app.use(cookieParser());

// Setup body parser
app.use(express.json());

// Routing request to => {BASE_URL}/api/v1/auth
app.use('/api/v1/auth', auth);

// Routing request to => {BASE_URL}/api/v1/register
app.use('/api/v1/register', register);

// Port on which Server run
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});



