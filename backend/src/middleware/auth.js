const { getAuth } = require('@clerk/express');

exports.authenticate = (req, res, next) => {
  const auth = getAuth(req);
  if (!auth.userId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  req.auth = auth;
  next();
};