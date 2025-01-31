const jwt = require('jsonwebtoken');
//const config = require('config');

try {
    function generateToken(data){
        return jwt.sign({data}, (process.env.SECRET), { expiresIn: '1h' });
    }
    
    module.exports = generateToken;
} catch (error) {
    res.status(500).send(`Error in generating token`);
}
