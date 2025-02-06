const jwt = require('jsonwebtoken');

try {
    const secret = process.env.SECRET;
    function generateToken(data){
        return jwt.sign({data}, (secret), { expiresIn: '1h' });
    }
    
    module.exports = generateToken;
} catch (error) {
    res.status(500).send(`Error in generating token`);
}
