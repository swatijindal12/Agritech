const mongoose = require('mongoose');

// farmer Model 
const farmSchema = new mongoose.Schema({
    farmer_id:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
        trim: true,
        minlegth: 3,
        maxlength: 50
    },
    address: {
        type: String,
        required: true,
        trim: true,
        minlegth: 5,
        maxlength: 200
    },
    pin:{
        type: Number,
        required: true,
        trim: true,
        minlength: [6, 'Please enter 6 digit Pin.'],
        maxlength: [6, 'Please enter 6 digit Pin.']
    },
    farmnft_id : {
        type : String,
        required:[true, 'Please check farmnft_id.'],
        unique: [true, 'Already used.']
    },
    ipfs_hash : {
        type: String,
        required : [true,"Please check IPFS store."],
        trim : true,
        unique:[true, 'Already used.'],
    },
    image_url : {
        type: String
    },
    video_url : {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    farm_size: {
        type: String,
        trim: true,
    },
    user_id: {
        type : String,
        ref : 'Farmer',
        required: true
    }
},  {timestamps:true, createdAt: 'created_at', updatedAt: 'updated_at' } )

// Return JSON Web Token


// Exporting userSchema as User  
module.exports = mongoose.model('Farm', farmSchema);