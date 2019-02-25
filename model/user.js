const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = db => {
  const hashPass = (plainTextPass, cb) => {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) return cb(err);
      bcrypt.hash(plainTextPass, salt, function(err, hashPass) {
        if (err) return cb(err);
        cb(hashPass);
      });
    });
  };

  const checkPass = (plainTextPass, hashedPass, cb) => {
    bcrypt.compare(plainTextPass, hashedPass, function(err, passMatch) {
      if (err) return cb(err);
      cb(passMatch); 
    });
  };

  return {
    hashPass,
    checkPass,
  };
};
