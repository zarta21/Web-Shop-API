const router = require('express').Router(); //https://expressjs.com/en/guide/routing.html
const User = require('../models/User');
const { verifyTokenAndAuth, verifyTokenAndAdmin } = require('./verifyToken'); //import verifyToken function from verifyToken.js file


//Endpoints:
//GET - retrieves resources.
//POST - submits new data to the server.
//PUT - updates existing data.
//DELETE - removes data. 
//https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/
//https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/


//UPDATE:
//************************************* */
router.put('/:id', verifyTokenAndAuth, async (req,res) => {
    //req - what we get from user (name, email, input etc.)
    //res - what we send for user

    //if user change password we have to encrypted again:
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_PASS).toString()
    }
    
    try{
        //to update user information use MongoDB function 'findByIdAndUpdate' and set new information from body:
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })

        res.status(200).json(updatedUser)
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//DELETE:
//************************************* */
router.delete('/:id', verifyTokenAndAuth, async (req,res) => {
    try{
        await User.findByIdAndDelete(req.params.id) // find and delete user

        res.status(200).json('User has been deleted')
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//GET USER:
//************************************* */
router.get('/find/:id', verifyTokenAndAdmin, async (req,res) => {
    try{
        const user =  await User.findByIdAnd(req.params.id) // find user by id
        
        //we don't want to send user password
        //use spread operator to send user information without password:
        const { password, ...others } = user._doc; //MongoDB store user infromation in '_doc' object. If we write only 'user' we get to match informatio we don't need;

        res.status(200).json(others); // if everything is ok return user information without password
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//GET ALL USERS:
//************************************* */
router.get('/', verifyTokenAndAdmin, async (req,res) => {
    const query = req.query.new //create query to get only new users

    try{
        //write a condition if there is query (.../new=true) send back 3 latest users if not send back all:
        const users = query ? await User.find().sort({_id:-1}).limit(3) : await User.find()

        res.status(200).json(users);
    } catch(err) {
        res.status(500).json(err);
    }
})
//************************************* */


//GET USER STATS:
//************************************* */
router.get('/stats', verifyTokenAndAdmin, async (req,res) => {
    //this function returns total register users number per month
    
    const date = new Date(); // current date
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1)); //last year today

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
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            { $project: { month: { $month: "$createdAt" } } },
            { $group: { _id: "$month", total: { $sum: 1 } } }
        ]);

        res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }

})
//************************************* */


//exporting module:
module.exports = router;