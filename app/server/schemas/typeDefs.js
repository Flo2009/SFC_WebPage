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
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    getAllSubmissions: [Submission]
    getSubmissionById(id: ID!): Submission
  }

  type Mutation {
    # FIX: Added password: String! right here
    addUser(username: String!, email: String!, password: String!, message: String): Auth!
    updateUser(id: ID!, username: String!, email: String!, message: String): User!
    login(email: String!, password: String!): Auth!
    submitInquiry(name: String!, email: String!, phone: String, type: String!, message: String!, resumeUrl: String): Submission!
    deleteSubmission(id: ID!): String
  }
`;

module.exports = typeDefs;


