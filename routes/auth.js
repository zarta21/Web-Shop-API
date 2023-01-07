const router = require('express').Router(); 
const User = require('../models/User'); 
const CryptoJS = require('crypto-js'); 
const jwt = require('jsonwebtoken'); 


router.post('/register', async (req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_PASS).toString()
    })

    try {
        const savedUser = await newUser.save(); 
        res.status(201).json(savedUser) 
    } catch(err) {
        res.status(500).json(err) 
    }
});


router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        !user && res.status(401).json("Wrong email!");

        const decryptedPass = CryptoJS.AES.decrypt(user.password, process.env.SECRET_PASS).toString(CryptoJS.enc.Utf8);

        decryptedPass !== req.body.password && res.status(401).json("Wrong Password!");

        const accessToken = jwt.sign({
            id: user._id, 
            isAdmin: user.isAdmin 
        }, process.env.JWT_SEC_KEY,
         { expiresIn: "1d" }) 

        const { password, ...others } = user._doc; 
        res.status(200).json({...others, accessToken}); 
    } catch(err) {
        res.status(500).json(err)
    }
})


module.exports = router;
