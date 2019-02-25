const SessionModel = require('../model/session');

module.exports = db => {
  const sessionModel = SessionModel(db);
  return (req, res, next) => {
    const { authorization, user_id } = req.headers;
    sessionModel.verifySession(authorization, user_id, (err, session) => {
      if (err) {
        return res.status(401).send({ error: 'Unauthorized' });
      } 
      req.user = session;
      return next();
    });
  };
};
