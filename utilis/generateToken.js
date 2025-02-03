const jwt = require('jsonwebtoken');
//const config = require('config');

try {
    //const secret = config.get("SECRET");
    const secret = process.env.SECRET;
    function generateToken(data){
        return jwt.sign({data}, (secret), { expiresIn: '1h' });
    }
    
    module.exports = generateToken;
} catch (error) {
    res.status(500).send(`Error in generating token`);
}
