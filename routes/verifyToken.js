const jwt = require('jsonwebtoken'); //https://www.npmjs.com/package/jsonwebtoken

const verifyToken = (req, res, next) => {
    //this function verify web token
    //req - what we get from user (name, email, input etc.)
    //res - what we send for user

    const authHeader = req.headers.token

    if(authHeader) {
        const token = authHeader.split(" ")[1]; // split "bearer token" by space and take second part with is our token. Word "Bearer" is not needed
        
        //verifying jwb:
        jwt.verify(token, process.env.JWT_SEC_KEY, (err, user) => {
            if (err) res.status(403).json("Access forbidden! Token is not valid"); // if there are an error in verifying proccess
            // return "forbidden" messagge

            req.user = user; // if token is valid return data (user)
            next();
        })
    } else {
        // if there is no header (web token) return "not authenticated" messagge
        return res.status(401).json("You are not authenticated!") 
    }
};


const verifyTokenAndAuth = (req, res, next) => {
    //this function verify web token authorization

    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next(); // if we verify user, continue
        } else{
            res.status(403).json("Access forbidden!"); //error messagge if user is not verify
        }
    })
}


const verifyTokenAndAdmin = (req, res, next) => {
    //this function check if user is Admin

    verifyToken(req, res, () => {
        if(req.user.isAdmin) {
            next(); // if we verify user, continue
        } else{
            res.status(403).json("Access forbidden!"); //error messagge if user is not verify
        }
    })
}


module.exports = { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin }