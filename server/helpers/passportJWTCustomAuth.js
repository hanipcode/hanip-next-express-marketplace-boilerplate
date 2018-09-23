const passport = require('passport');

module.exports = function passportJWTCustomAuth(req, res, next) {
  return passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized',
      });
    }
    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized',
      });
    }
    next();
  })(req, res, next);
};
