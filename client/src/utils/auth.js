const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  getProfile: function (token) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      throw new Error('Token is invalid or expired.');
    }
  },
  loggedIn: function (token) {
    try {
      jwt.verify(token, secret);
      return true;
    } catch (err) {
      return false;
    }
  },
  isTokenExpired: function (token) {
    try {
      const decoded = jwt.decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  },
};