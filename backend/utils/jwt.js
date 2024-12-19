const { sign, verify } = require("jsonwebtoken");
const jwt = require('jsonwebtoken');

function generateToken(user) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(
        { 
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}

module.exports = { generateToken };


const verifyToken = (token) => {
    return verify(token, process.env.JWT_SECRET); // Verifies and decodes the token
};

module.exports = { generateToken, verifyToken };
