const { GraphQLError } = require('graphql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Submission, Blog, Job } = require('../models');
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      console.log(context.user);
      if (!context.user){
        throw new GraphQLError("Please Log In!", { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return await User.findById(context.user._id);
    },
    getAllUsers: async (parent, args, context) => {
      if (!context.user) {
        throw new GraphQLError("Access denied. Please Log In!", { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return await User.find({});
    },
    getAllSubmissions: async (parent, args, context) => {
      console.log(context.user);
      if (!context.user){
        throw new GraphQLError("Access denied. Please Log In!", { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return await Submission.find({}).sort({ createdAt: -1 });
    },
    getSubmissionById: async (parent, { id }, context) => {
      if (!context.user){
        throw new GraphQLError("Access denied. Please Log In!", { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return await Submission.findById(id);
    },
    getAllBlogs: async () => {
      return await Blog.find({}).populate('author').sort({ createdAt: -1 });
    },
    getBlogById: async (parent, { id }) => {
      return await Blog.findById(id).populate('author');
    },

    // PUBLIC JOB BOARD QUERIES
    getAllJobs: async () => {
      return await Job.find({}).sort({ createdAt: -1 });
    },
    getJobById: async (parent, { id }) => {
      return await Job.findById(id);
    }
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      console.log(email);
      const user = await User.findOne({ email });
      if (!user){
        throw new GraphQLError("Please Enter your Email!", { extensions: { code: 'BAD_USER_INPUT' } });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(isPasswordValid);
      if (!isPasswordValid){
        throw new GraphQLError('Incorrect Password!', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, { username, email, password, message }) => {
      const hashedPassword = await bcrypt.hash(password, 5);
      console.log(hashedPassword);
      const user = await User.create({ username, email, password: hashedPassword, message });
      const token = signToken(user);
      return { token, user };
    },

    updateUser: async (parent, { id, username, email, message }, context) => {
      if (!context.user){
        throw new GraphQLError('You need to log in!', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return await User.findByIdAndUpdate(id, { username, email, message }, { new: true });
    },
    deleteUser: async (parent, { id }, context) => {
      if (!context.user) {
        throw new GraphQLError("Access denied. Please Log In!", { extensions: { code: 'UNAUTHENTICATED' } });
      }
      await User.findByIdAndDelete(id);
      return "Admin user successfully deleted.";
    },
    submitInquiry: async (parent, { name, email, phone, type, message, resumeUrl, location, preferredContact }) => {
      console.log(name, type);
      if (!['CLIENT', 'CANDIDATE'].includes(type)) {
        throw new Error('Invalid type value. Must be CLIENT or CANDIDATE');
      }
      return await Submission.create({ name, email, phone, type, message, resumeUrl, location, preferredContact });
    },

    deleteSubmission: async (parent, { id }, context) => {
      if (!context.user){
        throw new GraphQLError('You need to log in!', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      try {
        await Submission.findByIdAndDelete(id);
        return "Submission successfully deleted.";
      } catch (err) {
        console.log(err);
        return "An Error occurred during the deletion process.";
      }
    },

    createBlog: async (parent, { title, content, summary, imageUrl }, context) => {
      if (!context.user) {
        throw new GraphQLError('Access denied. Log in to post blogs.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      const blog = await Blog.create({ title, content, summary, imageUrl, author: context.user._id });
      return await blog.populate('author');
    },

    updateBlog: async (parent, { id, title, content, summary, imageUrl }, context) => {
      if (!context.user) {
        throw new GraphQLError('Access denied. Log in to update content.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return await Blog.findByIdAndUpdate(id, { title, content, summary, imageUrl }, { new: true }).populate('author');
    },

    deleteBlog: async (parent, { id }, context) => {
      if (!context.user) {
        throw new GraphQLError('Access denied. Log in to remove content.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      await Blog.findByIdAndDelete(id);
      return "Blog post successfully deleted.";
    },

    // PROTECTED JOB BOARD MUTATIONS
    createJob: async (parent, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Access denied. Log in to create job listings.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return await Job.create(args);
    },

    updateJob: async (parent, { id, ...updateData }, context) => {
      if (!context.user) {
        throw new GraphQLError('Access denied. Log in to edit job listings.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return await Job.findByIdAndUpdate(id, updateData, { new: true });
    },

    deleteJob: async (parent, { id }, context) => {
      if (!context.user) {
        throw new GraphQLError('Access denied. Log in to remove job listings.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      await Job.findByIdAndDelete(id);
      return "Job listing successfully deleted.";
    }
  },
};

module.exports = resolvers;

