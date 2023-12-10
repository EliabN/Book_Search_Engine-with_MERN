const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, { username }, context) => {
      
      try {
        if (context.user) {
          const user = await User.findOne({ _id: context.user._id });

          console.log(user)
          return user;
        }
        throw new Error("User not logged in!");
      } catch (e) {
        console.log(e);
      }
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      try {
        // Look up the user by the provided email address. Since the `email` field is unique, we know that only one person will exist with that email
        const user = await User.findOne({ email });

        // If there is no user with that email address, return an Authentication error stating so
        if (!user) {
          throw AuthenticationError
        }

        // If there is a user found, execute the `isCorrectPassword` instance method and check if the correct password was provided
        const correctPw = await user.isCorrectPassword(password);

        // If the password is incorrect, return an Authentication error stating so
        if (!correctPw) {
          throw AuthenticationError
        }

        // If email and password are correct, sign user into the application with a JWT
        const token = signToken(user);

        // Return an `Auth` object that consists of the signed token and user's information
        return { token, user };
      } catch (err) {
        console.log(err);
      }
    },
    addUser: async (parent, { username, email, password }) => {
      try {
        // First we create the user
        const user = await User.create({ username, email, password });
        // To reduce friction for the user, we immediately sign a JSON Web Token and log the user in after they are created
        const token = signToken(user);
        // Return an `Auth` object that consists of the signed token and user's information
        return { token, user };
      } catch (err) {
        console.log(err);
      }
    },
    saveBook: async (parent, { bookInput }, { user, res }) => {
      console.log(user)
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: bookInput } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      } catch (err) {
        console.log(err);
      }
    },
    removeBook: async (parent, { bookId }, { user, res }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        if (!updatedUser) {
          throw new Error("Couldn't find user with this ID!");
        }

        return updatedUser;
      } catch (err) {
        console.log(err);
      }
    },
  },
};

module.exports = resolvers;
