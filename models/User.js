const mongoose = require('mongoose') 

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true, writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 1000
  } }
);


module.exports = mongoose.model('User', UserSchema) 
