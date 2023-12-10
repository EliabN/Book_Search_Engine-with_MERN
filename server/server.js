const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

// Import GraphQL type definitions and resolvers
const { typeDefs, resolvers } = require('./schemas');
// Import database connection
const db = require('./config/connection');
// Import authentication middleware
const { authMiddleware } = require('./utils/auth');

// Set the PORT for the server @3001
const PORT = process.env.PORT || 3001;
// Create an Express application - app
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Set authentication middleware for Apollo Server context
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Serve client/dist as static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Send index.html for all routes in production
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const startApolloServer = async () => {
  // Start Apollo Server
  await server.start();
  // Apply Apollo Server middleware to Express app
  server.applyMiddleware({ app })
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Start the Apollo Server
startApolloServer();  