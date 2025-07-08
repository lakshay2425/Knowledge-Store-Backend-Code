import arcjet, { shield } from "@arcjet/node";
import config from "../config/config.js"

const attackProtection = arcjet({
  key: config.get("ARCJET_KEY"),
  rules: [
    shield({
      mode: "DRY_RUN",
    }),
  ],
});

export default attackProtection;