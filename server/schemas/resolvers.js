const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (_, { id, username }, { res }) => {
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
    login: async (_, { email, password }, { res }) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("Can't find this user!");
        }

        const correctPw = await user.isCorrectPassword(password);

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
    addUser: async (_, { username, email, password }, { res }) => {
      try {
        const user = await User.create({ username, email, password });

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
    removeBook: async (_, { bookId }, { user, res }) => {
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
