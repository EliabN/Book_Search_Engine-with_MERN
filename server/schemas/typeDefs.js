const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    savedBooks: [Book]
    # You can define other user fields here
  }

  type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    getSingleUser(id: ID, username: String): User
    # Add other query types here if needed
  }

  type Mutation {
    createUser(input: CreateUserInput!): AuthPayload
    loginUser(input: LoginInput!): AuthPayload
    saveBook(bookInput: BookInput!): User
    deleteBook(bookId: String!): User
    # Add other mutation types here if needed
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
    # Add other user input fields here
  }

  input LoginInput {
    username: String
    email: String
    password: String!
  }
`;

module.exports = typeDefs;
