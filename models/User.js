const mongoose = require('mongoose') //https://mongoosejs.com/docs/api.html#mongoose_Mongoose


//Everything in Mongoose starts with a Schema. 
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
//More about mongoose schemas:
//https://mongoosejs.com/docs/guide.html


//creating user schema:
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


//To use our schema definition, we need to convert our UserSchema into a Model we can work with:
module.exports = mongoose.model('User', UserSchema) //exporting user model