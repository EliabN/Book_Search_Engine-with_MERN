const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, { id, username }, { user }) => {
      console.log(user)
      try {
        if (user) {
          const foundUser = await User.findOne({
            //$or: [{ _id: id }, { username: username }],
            _id: user._id
          });

          console.log(foundUser)
          return foundUser;
        }

        if (!foundUser) {
          throw new Error('Cannot find a user with this ID or username!');
        }
        
      } catch (err) {
        console.log(err);
      }
    },
  },
  Mutation: {
    login: async (parent, { email, password }, { res }) => {
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
        console.log(err);
      }
    },
    addUser: async (parent, { username, email, password }, { res }) => {
      try {
        const user = await User.create({ username, email, password });

        if (!user) {
          throw new Error('Something is wrong with user creation!');
        }
        console.log(user)

        const token = signToken(user);
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
