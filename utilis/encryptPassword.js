const bcrypt = require('bcrypt');

// Function to encrypt password using async/await
module.exports.encryptPass = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};