const router = require('express').Router(); //https://expressjs.com/en/guide/routing.html
const User = require('../models/User'); //import User model from User.js
const CryptoJS = require('crypto-js'); //https://www.npmjs.com/package/crypto-js
const jwt = require('jsonwebtoken'); //https://www.npmjs.com/package/jsonwebtoken


//Endpoints:
//GET - retrieves resources.
//POST - submits new data to the server.
//PUT - updates existing data.
//DELETE - removes data. 
//https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/
//https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/


//CREATE USER REGISTER:
//use post method, because user will send us information (username, password)
//******************************************** */
router.post('/register', async (req, res) => {
    //req - what we get from user (name, email, input etc.)
    //res - what we send for user

    const newUser = new User({
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_PASS).toString()
    })
    //password is encrypted using AES algorithm
    //https://cryptojs.gitbook.io/docs/

    //send user to our DB:
    try {
        const savedUser = await newUser.save(); //saving user
        res.status(201).json(savedUser) //send status code and user
    } catch(err) {
        res.status(500).json(err) // send error
    }

    //More about status code:
    //https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
});
//******************************************* */


//CREATE LOGIN:
//******************************************* */
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        //if there is no user send back err message to user:
        !user && res.status(401).json("Wrong email!");

        //decrypt user password:
        const decryptedPass = CryptoJS.AES.decrypt(user.password, process.env.SECRET_PASS).toString(CryptoJS.enc.Utf8);

        //if password is incorect send back err message to user:
        decryptedPass !== req.body.password && res.status(401).json("Wrong Password!");

        const accessToken = jwt.sign({
            id: user._id, // use _id for user identification
            isAdmin: user.isAdmin // check if user is admin
        }, process.env.JWT_SEC_KEY,
         { expiresIn: "1d" }) // creating access token. '_id' is from MongoDB. 'expiresIn' set how long web token is valid (if it not valid user must login again)


        //we don't want to send password even this is encrypted
        //use spread operator to send other information without password:
        const { password, ...others } = user._doc; //MongoDB store user infromation in '_doc' object. If we write only 'user' we get to match informatio we don't need;

        res.status(200).json({...others, accessToken}); // if everything is ok return user without password and webToken
    } catch(err) {
        res.status(500).json(err)
    }
})
//****************************************** */


//exporting module:
module.exports = router;