const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token'); //get the token from the header

    // check for token
    if (!token) {
        res.status(401).json({
            msg: 'No token, authorization denied'
        }) // unauthorized
    }

    try {
        // verify token
        const decoded = jwt.verify(token, config.get('jwtSecret')); //check if it is a valid JWT token (not actually checking if the user exists)

        // add user from payload
        req.user = decoded;

        next();
    } catch(e) {
        res.status(400).json({
            msg: 'Token is not valid'
        });
    }
}

module.exports = auth;