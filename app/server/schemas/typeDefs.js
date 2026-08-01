const typeDefs = `
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

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    getAllSubmissions: [Submission]
    getSubmissionById(id: ID!): Submission
    getAllBlogs: [Blog]
    getBlogById(id: ID!): Blog
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!, message: String): Auth!
    updateUser(id: ID!, username: String!, email: String!, message: String): User!
    login(email: String!, password: String!): Auth!
    submitInquiry(name: String!, email: String!, phone: String, type: String!, message: String!, resumeUrl: String, location: String, preferredContact: String): Submission!
    deleteSubmission(id: ID!): String
    
    # UPDATED THESE MUTATIONS TO ACCEPT AN IMAGE URL
    createBlog(title: String!, content: String!, summary: String, imageUrl: String): Blog!
    updateBlog(id: ID!, title: String, content: String, summary: String, imageUrl: String): Blog!
    deleteBlog(id: ID!): String
  }
`;

module.exports = typeDefs;



