const router = require('express').Router(); //https://expressjs.com/en/guide/routing.html
const Order = require('../models/Order');
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

    const newOrder = new Order(req.body);

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    } catch(err) {
        res.status(500).json(err)
    }
});
//************************************* */


//UPDATE:
//************************************* */
router.put('/:id', verifyTokenAndAdmin, async (req,res) => {
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })

        res.status(200).json(updatedOrder)
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//DELETE:
//************************************* */
router.delete('/:id', verifyTokenAndAdmin, async (req,res) => {
    try{
        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json('Order has been deleted')
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//GET USER ORDERS:
//************************************* */
router.get('/find/:userId', verifyTokenAndAuth, async (req,res) => {
    try{
        const orders =  await Order.find();
        res.status(200).json(orders);
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//GET ALL ORDERS:
//************************************* */
router.get('/', verifyTokenAndAdmin, async (req,res) => {
    try{
        const orders = await Order.find()

        res.status(200).json(orders);
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//GET STATS:
//************************************* */
router.get('/income', verifyTokenAndAdmin, async (req,res) => {
    //this function returns monthly income
    
    const productId = req.query.pid;
    const date = new Date(); // current date
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        //Aggregation is a way of processing a large number of documents in a collection by means of passing them through different stages. 
        //The stages make up what is known as a pipeline. The stages in a pipeline can filter, sort, group, reshape and modify documents 
        // that pass through the pipeline. 

        //More about MongoDB aggregation:
        //https://studio3t.com/knowledge-base/articles/mongodb-aggregation-framework/
        //https://www.mongodb.com/docs/manual/reference/command/aggregate/#mongodb-dbcommand-dbcmd.aggregate


        //$match stage – filters those documents we need to work with, those that fit our needs
        //$project stage is extremely useful for filtering a document to show only the fields we need by given criteries
        //$group stage, we can perform all the aggregation or summary queries that we need, such as finding counts, totals, averages or maximums
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth }, ...(productId && {
                products: { $elemMatch: { productId }}
            }) } },
            { $project: { 
                 month: { $month: "$createdAt" },
                 sales: "$amount"
              } 
             },
            { $group: { _id: "$month", total: { $sum: "$sales" } } }
        ]);

        res.status(200).json(income);
    } catch(err) {
        res.status(500).json(err);
    }

})
//************************************* */


//exporting module:
module.exports = router;