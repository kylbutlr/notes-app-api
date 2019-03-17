const SessionModel = require('../model/session');

module.exports = db => {
  const sessionModel = SessionModel(db);
  return (req, res, next) => {
    const { authorization } = req.headers;
    sessionModel.verifySession(authorization, (err, session) => {
      if (err) {
        return res.status(401).send({ error: 'Unauthorized' });
      }
      req.user = session;
      return next();
    });
  };
};
