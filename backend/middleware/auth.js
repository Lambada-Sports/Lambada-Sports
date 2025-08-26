const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-e6qbovpsssxtr7qp.us.auth0.com/.well-known/jwks.json`,
  }),
  audience: "https://dev-e6qbovpsssxtr7qp.us.auth0.com/api/v2/",
  issuer: "https://dev-e6qbovpsssxtr7qp.us.auth0.com/",
  algorithms: ["RS256"],
  requestProperty: "auth",
});

function attachCustomerId(req, res, next) {
  const user = req.auth || req.user;

  if (!user) {
    return res.status(401).json({
      error: "Authentication failed",
      message: "No user information found in token",
      debug: {
        hasAuth: !!req.auth,
        hasUser: !!req.user,
        hasAuthHeader: !!req.headers.authorization,
      },
    });
  }

  if (!user.sub) {
    return res.status(401).json({
      error: "Invalid token",
      message: "Token missing user identifier",
      user: user,
    });
  }

  if (req.user && req.user.sub) {
    req.customerId = req.user.sub;
  }
  next();
}

// Error handling middleware for JWT errors
function handleJwtError(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "Invalid token",
      details: err.message,
    });
  }
  next(err);
}

module.exports = { checkJwt, attachCustomerId, handleJwtError };
