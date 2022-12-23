const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// User Model 
const userSchema = new mongoose.Schema({
    ipfs_hash: {
        type: String,
        required : [true,"Please check IPFS store."],
        unique:[true, 'Already used.'],
        trim : true
    },
    country_code: {
        type : String,
        required:[true, 'Please enter valid countryCode.'],
        default : "+91"
    },
    mobile_number: {
        type: Number,
        required:[true, 'Please enter valid mobile number.'],
        unique:[true, 'Already used.'],
        trim : true
    },
    private_key: {
        type: String,
        required: [true, 'Private key error.'],
        unique:[true, 'Already used.']
    },
    private_key: {
        type: String,
        required: [true, 'Public key error.'],
        unique:[true, 'Already used.']
    },
    role: {
        type: String,
        required : [true, 'Please select Role.'],
        enum : {
            values : [
                'Farmer',
                'Validator',
                'Buyer',
            ],
            message : 'Please select correct options for Role.'
        }
    },
    
},  {timestamps:true, createdAt: 'created_at', updatedAt: 'updated_at' } )

// Return JSON Web Token
userSchema.methods.getJwtToken = function() {
    return jwt.sign({id : this._id}, process.env.JWT_SECRET,
             {expiresIn: process.env.JWT_EXPIRES_TIME}
             );
 }


// Exporting userSchema as User  
module.exports = mongoose.model('User', userSchema);