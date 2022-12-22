const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// User Model 
const agreementSchema = new mongoose.Schema({
    seller_id: {
        type: String,
        required : [true,"Please check IPFS store."],
        trim : true,
        unique:[true, 'Already used.'],
    },
    buyer_id: {
        type : String,
        required:[true, 'Please check farmnft_id.'],
        default : "+91"
    },
    agreementnft_id: {
        type: Boolean,
        required:[true, 'Please select validated status.'],
    },
    sold_status: {
        type : Boolean,
        default: false
    },
    agreementclose_status: {
        type : Boolean,
        default: false
    }
},  {timestamps:true, createdAt: 'created_at', updatedAt: 'updated_at' } )


// Exporting userSchema as User  
module.exports = mongoose.model('Agreement', agreementSchema);