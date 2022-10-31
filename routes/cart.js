const router = require('express').Router(); //https://expressjs.com/en/guide/routing.html
const Cart = require('../models/Cart');
const { verifyTokenAndAuth, verifyTokenAndAdmin, verifyToken } = require('./verifyToken'); //import verifyToken function from verifyToken.js file


//Endpoints:
//GET - retrieves resources.
//POST - submits new data to the server.
//PUT - updates existing data.
//DELETE - removes data. 
//https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/
//https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/


//CREATE:
//************************************* */
router.post('/', verifyToken, async (req, res) => {
    //req - what we get from user (name, email, input etc.)
    //res - what we send for user

    const newCart = new Cart(req.body);

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    } catch(err) {
        res.status(500).json(err)
    }
});
//************************************* */


//UPDATE:
//************************************* */
router.put('/:id', verifyToken, async (req,res) => {
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })

        res.status(200).json(updatedCart)
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//DELETE:
//************************************* */
router.delete('/:id', verifyToken, async (req,res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id);

        res.status(200).json('Cart has been deleted')
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//GET USER CART:
//************************************* */
router.get('/find/:userId', verifyTokenAndAuth, async (req,res) => {
    try{
        const cart =  await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//GET ALL CARTS:
//************************************* */
router.get('/', verifyTokenAndAdmin, async (req,res) => {
    try{
        const carts = await Cart.find()

        res.status(200).json(carts);
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//exporting module:
module.exports = router;