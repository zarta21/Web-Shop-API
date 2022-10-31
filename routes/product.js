const router = require('express').Router(); //https://expressjs.com/en/guide/routing.html
const Product = require('../models/Product');
const { verifyTokenAndAdmin } = require('./verifyToken'); 


//Endpoints:
//GET - retrieves resources.
//POST - submits new data to the server.
//PUT - updates existing data.
//DELETE - removes data. 
//https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/
//https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/


//CREATE:
//************************************* */
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    //req - what we get from user (name, email, input etc.)
    //res - what we send for user

    const newProduct = new Product(req.body);

    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct)
    } catch(err) {
        res.status(500).json(err)
    }
});
//************************************* */


//UPDATE:
//************************************* */
router.put('/:id', verifyTokenAndAdmin, async (req,res) => {
    try{
        //to update product information use MongoDB function 'findByIdAndUpdate' and set new information from body:
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })

        res.status(200).json(updatedProduct)
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//DELETE:
//************************************* */
router.delete('/:id', verifyTokenAndAdmin, async (req,res) => {
    try{
        await Product.findByIdAndDelete(req.params.id) // find and delete product

        res.status(200).json('Product has been deleted')
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//GET PRODUCT:
//************************************* */
router.get('/find/:id', async (req,res) => {
    try{
        const product =  await Product.findByIdAnd(req.params.id) // find product by id
        res.status(200).json(product);
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//GET ALL PRODUCTS:
//************************************* */
router.get('/', async (req,res) => {
    const queryNewPrd = req.query.new; //create query to get only new products
    const queryCategory = req.query.category; //create query to get products by category

    try{
        let products;
        
        if(queryNewPrd) {
            //write a condition if there is query (.../new=true) send back 10 latest products:
            products = await Product.find().sort({ createdAt: -1 }).limit(10)
        } else if(queryCategory) {
            products = await Product.find({ categories: { $in: [queryCategory] } });
        } else {
            products = await Product.find(); // send back all products
        }

        res.status(200).json(products);
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//exporting module:
module.exports = router;