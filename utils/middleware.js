// utils/middleware.js
const logRequests = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logRequests };
