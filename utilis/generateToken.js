const jwt = require('jsonwebtoken');

try {
    const secret = process.env.JWT_SECRET;
    function generateToken(subject){
        const payload = {
            sub: subject,
            role: 'user',
            iss : process.env.ISSUER,
            aud: process.env.AUDIENCE,
        };
        return jwt.sign(payload, (secret), { expiresIn: '2h' });
    }
    
    module.exports = generateToken;
} catch (error) {
    res.status(500).send(`Error in generating token`);
}
