const jwt = require('jsonwebtoken');


function generateToken(data){
    return jwt.sign({data}, config.get("SECRET"), { expiresIn: '1h' });
}

module.exports = generateToken;