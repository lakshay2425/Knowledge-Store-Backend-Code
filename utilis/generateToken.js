const jwt = require('jsonwebtoken');
const {config} = require("../config/config.js")

const secret = config.get("JWT_SECRET");

    function generateToken(subject){
        const payload = {
            sub: subject,
            role: 'user',
            iss : config.get("ISSUER"),
            aud: config.get("AUDIENCE"),
        };
        return jwt.sign(payload, (secret), { expiresIn: '2h' });
    }
module.exports = generateToken;