const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # 1. CORE DATA BASE OBJECT SCHEMAS
  type User {
    _id: ID!
    username: String!
    email: String!
    message: String
  }

  type Submission {
    _id: ID!
    name: String!
    email: String!
    phone: String
    type: String!
    message: String!
    resumeUrl: String
    location: String
    preferredContact: String
    createdAt: String
  }

  type Blog {
    _id: ID!
    title: String!
    content: String!
    summary: String
    imageUrl: String
    author: User
    createdAt: String
    updatedAt: String
  }

  type Job {
    _id: ID!
    title: String!
    companyName: String!
    description: String!
    requirements: String
    location: String!
    salaryRange: String
    imageUrl: String
    createdAt: String
  }

  type Testimonial {
    _id: ID!
    clientName: String!
    company: String!
    role: String
    quote: String!
    rating: Int
    imageUrl: String
    createdAt: String
  }

  type CandidateRepo {
  _id: ID!
  name: String!
  email: String!
  phone: String
  assignedPillar: String!
  extractedSkills: [String]
  resumeText: String!
  recruiterRating: Int!
  recruiterNotes: String!
  createdAt: String
  }

  type JobMandate {
  _id: ID!
  title: String!
  company: String!
  pillar: String!
  location: String!
  description: String!
  jdPdfData: String
  createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  # 🚀 OPEN-SOURCE CHAT DATA SCHEMAS: Embedded right along with your objects
  type ChatMessage {
    role: String!
    content: String!
  }

  input ChatMessageInput {
    role: String!
    content: String!
  }

  type Query {
    me: User
    getAllSubmissions: [Submission]
    getSubmissionById(id: ID!): Submission
    getAllBlogs: [Blog]
    getBlogById(id: ID!): Blog
    getAllJobs: [Job]
    getJobById(id: ID!): Job
    getAllUsers: [User]
    getAllTestimonials: [Testimonial]
    getAllCandidatesAdmin: [CandidateRepo]
    getCandidatesByPillar(pillar: String!): [CandidateRepo]
    getAllJobsPublic: [JobMandate]
  }

    type Mutation {
    addUser(username: String!, email: String!, password: String!, message: String): Auth!
    updateUser(id: ID!, username: String, email: String, message: String): User!
    login(email: String!, password: String!): Auth!
    
    submitInquiry(name: String!, email: String!, phone: String, type: String!, message: String!, resumeUrl: String, location: String, preferredContact: String): Submission!
    deleteSubmission(id: ID!): String
    
    createBlog(title: String!, content: String!, summary: String, imageUrl: String): Blog!
    updateBlog(id: ID!, title: String, content: String, summary: String, imageUrl: String): Blog!
    deleteBlog(id: ID!): String
    
    # PROTECTED JOB MUTATIONS: Only logged-in admins can manage job postings
    createJob(title: String!, companyName: String!, description: String!, requirements: String, location: String!, salaryRange: String, imageUrl: String): Job!
    updateJob(id: ID!, title: String, companyName: String, description: String, requirements: String, location: String, salaryRange: String, imageUrl: String): Job!
    deleteJob(id: ID!): String
    deleteUser(id: ID!): String
    
    createTestimonial(clientName: String!, company: String!, role: String, quote: String!, rating: Int, imageUrl: String): Testimonial!
    deleteTestimonial(id: ID!): String

    # 🚀 LOCAL AI INTERFACE: Streams chat records to your local open-source server
    sendAssistantMessage(history: [ChatMessageInput!]!): String!

     # 🔒 PROTECTED CANDIDATE REMOVAL ENDPOINT: Requires signed recruiter token credentials
    purgeCandidateFromRepo(id: ID!): String!
  
    # Find and update this line to include the assignedPillar option variable:
    updateCandidateEvaluation(id: ID!, rating: Int!, notes: String!, assignedPillar: String): CandidateRepo!

    # 🚀 Allows you to manually upload a resume into a specific category from your dashboard
    processSecureResumeIntake(fileName: String!, fileData: String!, email: String!, forcedPillar: String): CandidateRepo!

    # 🚀 Added optional jdPdfData text argument string
    createJobMandate(title: String!, pillar: String!, description: String!, location: String, jdPdfData: String): JobMandate!
    removeJobMandate(id: ID!): String!
  }
`;

module.exports = typeDefs;




