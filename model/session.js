const jwt = require('jsonwebtoken');

module.exports = db => {
  const signSession = (user_id, username, cb) => {
    jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
        user_id: user_id,
        username: username,
      },
      'secretPass',
      (err, jwt) => {
        if (err) throw err;
        const newData = { jwt, user_id, username };
        return cb(newData);
      }
    );
  };

  const verifySession = (session, cb) => {
    jwt.verify(session, 'secretPass', (err, decoded) => {
      if (err) {
        return cb(err);
      }
      if (decoded.user_id !== false) {
        cb(null, decoded);
      }
    });
  };

  return {
    verifySession,
    signSession,
  };
};