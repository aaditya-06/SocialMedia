module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};


// This helper function is used to wrap async route handlers so
//  that any error thrown gets passed to next()
//  — which then triggers your error-handling middleware.
