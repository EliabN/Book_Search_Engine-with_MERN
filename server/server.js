const express = require('express');
// // For queries and mutations
// const { ApolloServer } = require('@apollo/server');
// const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');

// // For queries and mutations
// const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// TODO: Comment/remove out this code once you have built out queries and mutations in the client folder
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();
// // For queries and mutations
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// // For queries and mutations
// const startApolloServer = async () => {
//   await server.start();
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // // For queries and mutations
  // app.use('/graphql', expressMiddleware(server));

  // TODO: Comment/remove out this code once you have built out queries and mutations in the client folder
  app.use(routes);

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // // For queries and mutations
    // app.get('*', (req, res) => {
      // res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    // });
  } // closes if (process.env.NODE_ENV === 'production') condition

// // For queries and mutations
//   db.once('open', () => {
//     app.listen(PORT, () => {
//       console.log(`API server running on port ${PORT}!`);
//       console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
//     });
//   });
// };

// TODO: Comment/remove out this code once you have built out queries and mutations in the client folder
db.once('open', () => {
  app.listen(PORT, () => console.log(`Now listening on localhost: ${PORT}`));
});

// // For queries and mutations
// startApolloServer();
