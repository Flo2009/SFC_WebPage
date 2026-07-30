const { GraphQLError } = require('graphql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Submission } = require('../models');
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      console.log(context.user);
      if (!context.user){
        throw new GraphQLError("Please Log In!", {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      const user = await User.findById(context.user._id);
      return user;
    },
    
    // Protected Query: Fetches all chatbot entries for your admin dashboard
    getAllSubmissions: async (parent, args, context) => {
      console.log(context.user);
      if (!context.user){
        throw new GraphQLError("Access denied. Please Log In!", {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      return await Submission.find({}).sort({ createdAt: -1 });
    },

    // Protected Query: Fetches a single submission details by MongoDB Object ID
    getSubmissionById: async (parent, { id }, context) => {
      if (!context.user){
        throw new GraphQLError("Access denied. Please Log In!", {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      return await Submission.findById(id);
    }
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      console.log(email);
      const user = await User.findOne({ email });
      if (!user){
        throw new GraphQLError("Please Enter your Email!", {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(isPasswordValid);
      if (!isPasswordValid){
        throw new GraphQLError('Incorrect Password!', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      const token = signToken(user);
      return {
        token,
        user,
      };
    },

    addUser: async (parent, { username, email, password, donationAmount, donated }) => {
      const hashedPassword = await bcrypt.hash(password, 5);
      console.log(hashedPassword);
      const user = await User.create(
        { username, email, password: hashedPassword, donationAmount, donated }
      );
      const token = signToken(user);
      return {
        token,
        user,
      };
    },

    updateUser: async (parent, { id, username, email, message }, context) => {
      if (!context.user){
        throw new GraphQLError('You need to log in!', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { username, email, message },
        { new: true }
      );
      return updatedUser;
    },

    // PUBLIC MUTATION: Fired directly by your React ChatBot when conversation completes
    submitInquiry: async (parent, { name, email, phone, type, message, resumeUrl }) => {
      console.log(name, type);
      if (!['CLIENT', 'CANDIDATE'].includes(type)) {
        throw new Error('Invalid type value. Must be CLIENT or CANDIDATE');
      }
      const submission = await Submission.create({
        name,
        email,
        phone,
        type,
        message,
        resumeUrl
      });
      return submission;
    },

    // Protected Mutation: Deletes an inquiry entry from your dashboard view
    deleteSubmission: async (parent, { id }, context) => {
      if (!context.user){
        throw new GraphQLError('You need to log in!', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      try {
        await Submission.findByIdAndDelete(id);
        return "Submission successfully deleted.";
      } catch (err) {
        console.log(err);
        return "An Error occurred during the deletion process.";
      }
    }
  },
};

module.exports = resolvers;

