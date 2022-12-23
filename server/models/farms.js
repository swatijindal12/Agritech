const mongoose = require('mongoose');

// User Model 
const farmSchema = new mongoose.Schema({
    ipfs_hash: {
        type: String,
        required : [true,"Please check IPFS store."],
        trim : true,
        unique:[true, 'Already used.'],
    },
    farmnft_id: {
        type : String,
        required:[true, 'Please check farmnft_id.'],
        unique: [true, 'Already used.']
    },
    validated_status: {
        type: Boolean,
        required:[true, 'Please select validated status.'],
    },
    user_id: {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required: true
    }
},  {timestamps:true, createdAt: 'created_at', updatedAt: 'updated_at' } )


// Exporting userSchema as User  
module.exports = mongoose.model('Farm', farmSchema);