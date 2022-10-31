const dotenv = require('dotenv') //https://www.npmjs.com/package/dotenv
dotenv.config(); //this function loads .env file content

const express = require('express') //https://expressjs.com/en/5x/api.html
const app = express(); //Creates an Express application. The express() function is a top-level function exported by the express module.
const mongoose = require('mongoose') //https://mongoosejs.com/docs/api.html#mongoose_Mongoose

const userRoute = require('./routes/user') // import user route
const productRoute = require('./routes/product') // import product route
const cartRoute = require('./routes/cart') // import cart route
const orderRoute = require('./routes/order') // import order route
const authRoute = require('./routes/auth') // import authentication route


// connect to yours MongoDB cluster:
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        //if connection successfull do something...
        console.log("Connection to MongoDB successfull");
    }).catch((err) => {
        //if there is an error catch it
        console.log(err)
    });


//Endpoints:
// get/name - get all files and get/name/:id - get a single file
// post/name - create new file 
//delete/name/:id - delete file
//patch/name/:id - update file
//https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/
//https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/


app.use(express.json()); // this let us send json file to server

//use imported endpoints:
app.use('/api/auth', authRoute); //authentication route and endpoint
app.use('/api/users', userRoute); //user endpoint and route
app.use('/api/products', productRoute); //product endpoint and route
app.use('/api/carts', cartRoute); //cart endpoint and route
app.use('/api/orders', orderRoute); //order endpoint and route


// Run server using listen() function:
// First arrgument is port number and second is callback function
app.listen(process.env.PORT || 4000, () => {
    //Do something...
    //example:
    console.log(`Backend server is running on ${process.env.PORT}!`)
})