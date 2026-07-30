const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    message: String
  }

  type Query {
    me: User
  }
  
  type Mutation {
    
    addUser(username: String!, email: String!, message: String): User!
    updateUser(id:ID!, username: String!, email: String!, message: String):User!
    
  }
`;

module.exports = typeDefs;
