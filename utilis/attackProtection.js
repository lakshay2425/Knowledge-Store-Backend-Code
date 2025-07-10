const { shield } = require("@arcjet/node");
const {config} = require("../config/config.js");
const arcjet = require("@arcjet/node");


const attackProtection = arcjet({
  key: config.get("ARCJET_KEY"),
  rules: [
    shield({
      mode: "DRY_RUN",
    }),
  ],
});

module.exports =  attackProtection;