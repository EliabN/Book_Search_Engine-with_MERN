const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Fetch a single user by ID or username
    getSingleUser: async (_, { id, username }, { res }) => {
      try {
        const foundUser = await User.findOne({
          $or: [{ _id: id }, { username: username }],
        });

        if (!foundUser) {
          throw new Error('Cannot find a user with this ID or username!');
        }

        return foundUser;
      } catch (err) {
        res.status(400).json({ message: err.message });
        return null;
      }
    },
  },
  Mutation: {
    // Create a new user, sign a token, and return token with user details
    createUser: async (_, { input }, { res }) => {
      try {
        const user = await User.create(input);

        if (!user) {
          throw new Error('Something is wrong with user creation!');
        }

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        res.status(400).json({ message: err.message });
        return null;
      }
    },
    // Login a user, sign a token, and return token with user details
    loginUser: async (_, { input }, { res }) => {
      try {
        const user = await User.findOne({
          $or: [{ username: input.username }, { email: input.email }],
        });

        if (!user) {
          throw new Error("Can't find this user!");
        }

        const correctPw = await user.isCorrectPassword(input.password);

        if (!correctPw) {
          throw new Error('Wrong password!');
        }

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        res.status(400).json({ message: err.message });
        return null;
      }
    },
    // Save a book to a user's `savedBooks`
    saveBook: async (_, { bookInput }, { user, res }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: bookInput } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      } catch (err) {
        res.status(400).json(err);
        return null;
      }
    },
    // Remove a book from `savedBooks`
    deleteBook: async (_, { bookId }, { user, res }) => {
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
        res.status(404).json({ message: err.message });
        return null;
      }
    },
  },
};

module.exports = resolvers;
