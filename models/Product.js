const mongoose = require('mongoose') //https://mongoosejs.com/docs/api.html#mongoose_Mongoose


//Everything in Mongoose starts with a Schema. 
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
//More about mongoose schemas:
//https://mongoosejs.com/docs/guide.html


//creating product schema:
const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true}
}, { timestamps: true, writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 1000
  } }
);


//To use our schema definition, we need to convert our ProductSchema into a Model we can work with:
module.exports = mongoose.model('Product', ProductSchema) //exporting product model