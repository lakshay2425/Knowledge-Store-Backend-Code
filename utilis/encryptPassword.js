const bcrypt = require('bcrypt');

  try {
    // Function to encrypt password
    module.exports.encryptPass = (password) => {
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) reject(err);
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
          });
        });
      });
    };    
  } catch (error) {
    res.status(500).send(`Error : ${error.message}`);
  }