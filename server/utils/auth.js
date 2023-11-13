const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Middleware for authenticated routes
  authMiddleware: function ({ req }) {
    // Allows token to be sent via req.query, headers, or req.body
    let token = req.query.token || req.headers.authorization || req.body.token;

    // ["Bearer", "<tokenvalue>"]
    // If token is in the authorization header, extract it
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // If no token, return the original req
    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    // Return the modified req
    return req;
  },

  // Function to sign a new JWT based on user data
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    // Sign the token with user data, secret, and expiration
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
