const jwt = require('jsonwebtoken');

try {
    function generateToken(data){
        return jwt.sign({data}, config.get("SECRET"), { expiresIn: '1h' });
    }
    
    module.exports = generateToken;
} catch (error) {
    res.status(500).send(`Error in generating token`);
}
