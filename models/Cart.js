const mongoose = require('mongoose') //https://mongoosejs.com/docs/api.html#mongoose_Mongoose


//Everything in Mongoose starts with a Schema. 
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
//More about mongoose schemas:
//https://mongoosejs.com/docs/guide.html


//creating cart schema:
const CartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
        {
            productId: { type: String },
            quantity: { type: Number, default: 1 }
        }
    ]
}, { timestamps: true, writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 1000
  } }
);


//To use our schema definition, we need to convert our CartSchema into a Model we can work with:
module.exports = mongoose.model('Cart', CartSchema) //exporting cart model