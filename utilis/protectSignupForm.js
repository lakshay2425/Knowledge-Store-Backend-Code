const { protectSignup } = require("@arcjet/node");
const {config} = require("../config/config.js");
const arcjet = require("@arcjet/node");

const formProtection = arcjet({
  key: config.get("ARCJET_KEY"),
  rules: [
    protectSignup({
      email: {
        mode: "LIVE", 
        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      },
      bots: {
        mode: "LIVE",
        allow: [], 
      },
      rateLimit: {
        mode: "LIVE",
        interval: "10m", 
        max: 10, 
      },
    }),
  ],
});


module.exports  = formProtection;
