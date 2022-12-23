const mongoose = require('mongoose');


const connectDatabase = () => { mongoose.connect(process.env.DB_LOCAL_URI , {
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(()=> {
    console.log(`MongoDB Database connected with host`);
    });
};

// To remove Deprecation Warning
mongoose.set('strictQuery', true);

module.exports = connectDatabase;