const dotenv = require('dotenv') 
dotenv.config(); 

const express = require('express') 
const app = express(); 
const mongoose = require('mongoose') 

const userRoute = require('./routes/user') 
const productRoute = require('./routes/product') 
const cartRoute = require('./routes/cart') 
const orderRoute = require('./routes/order') 
const authRoute = require('./routes/auth') 



mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connection to MongoDB successfull");
    }).catch((err) => {
        console.log(err)
    });


app.use(express.json()); // this let us send json file to server


app.use('/api/auth', authRoute); 
app.use('/api/users', userRoute); 
app.use('/api/products', productRoute); 
app.use('/api/carts', cartRoute); 
app.use('/api/orders', orderRoute); 

app.listen(process.env.PORT || 4000, () => {
    console.log(`Backend server is running on ${process.env.PORT}!`)
})
