const express = require('express');
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

// Importing to read file
const fileupload = require("express-fileupload");

// Middleware for express-fileupload
app.use(fileupload());

// Importing uploadImage to S3 
const uploadImage = require('./utils/fileupload')

// Importing all routes.
const auth = require('./routes/auth');
const register = require('./routes/register');
const farmer = require('./routes/farm')


// Setup CORS - accessible by other domains
app.use(cors());

// Set cookie parser
app.use(cookieParser());

// Setup body parser
app.use(express.json());

// Routing request to => {BASE_URL}/api/v1/auth to authenticate User.
app.use('/api/v1/auth', auth);

// Routing request to => {BASE_URL}/api/v1/register to create User.
app.use('/api/v1/register', register);

// Routing request to => {BASE_URL}/api/v1/farmer to create User.
app.use('/api/v1/farmer', farmer);


// TESTING S3 image upload handler 
app.post("/upload", async (req, res) => {
    // the file when inserted from form-data comes in req.files.file
    const presignedURL = await uploadImage(req.files.file);

    // returning fileupload location
    return res.status(200).json({ location: presignedURL });
});
// TESTING

// Port on which Server run
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});



