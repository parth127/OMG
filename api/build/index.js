"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _neo4jGraphqlJs = require("neo4j-graphql-js");

var _graphqlSchema = require("./graphql-schema");

var _apolloServerExpress = require("apollo-server-express");

var _express = _interopRequireDefault(require("express"));

var _neo4jDriver = _interopRequireWildcard(require("neo4j-driver"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _expressJwt = _interopRequireDefault(require("express-jwt"));

/* eslint-disable no-unused-vars */
//import context from 'react-bootstrap/esm/AccordionContext'
const filePath = require('path');

const fs = require('fs'); // set environment variables from .env


_dotenv.default.config();

const app = (0, _express.default)();
app.use(_express.default.json());

const checkErrorHeaderMiddleware = async (req, res, next) => {
  req.error = req.headers['x-error'];
  next();
};

app.use('*', checkErrorHeaderMiddleware);
/*
 * Create an executable GraphQL schema object from GraphQL type definitions
 * including autogenerated queries and mutations.
 * Optionally a config object can be included to specify which types to include
 * in generated queries and/or mutations. Read more in the docs:
 * https://grandstack.io/docs/neo4j-graphql-js-api.html#makeaugmentedschemaoptions-graphqlschema
 */

const schema = (0, _neo4jGraphqlJs.makeAugmentedSchema)({
  typeDefs: _graphqlSchema.typeDefs,
  resolvers: _graphqlSchema.resolvers,
  config: {
    query: {
      exclude: ['RatingCount', 'AuthToken']
    },
    mutation: {
      exclude: ['RatingCount', 'AuthToken']
    },
    auth: {
      isAuthenticated: true,
      hasRole: false
    }
  }
});
/*
 * Create a Neo4j driver instance to connect to the database
 * using credentials specified as environment variables
 * with fallback to defaults
 */

const driver = _neo4jDriver.default.driver(process.env.NEO4J_URI || 'bolt://localhost:7687', _neo4jDriver.default.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'neo4j'));
/*
 * Create a new ApolloServer instance, serving the GraphQL schema
 * created using makeAugmentedSchema above and injecting the Neo4j driver
 * instance into the context object so it is available in the
 * generated resolvers to connect to the database.
 */


const server = new _apolloServerExpress.ApolloServer({
  context: ({
    req
  }) => {
    var _req$user;

    return {
      headers: req.headers,
      req,
      driver,
      cypherParams: {
        userId: req === null || req === void 0 ? void 0 : (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.userId
      },
      neo4jDatabase: process.env.NEO4J_DATABASE
    };
  },
  schema: schema,
  introspection: false,
  playground: true
}); // Specify host, port and path for GraphQL endpoint

const port = process.env.GRAPHQL_SERVER_PORT || 4001;
const path = process.env.GRAPHQL_SERVER_PATH || '/graphql';
const host = process.env.GRAPHQL_SERVER_HOST || '0.0.0.0';
app.use((0, _expressJwt.default)({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false
}));
/*
 * Optionally, apply Express middleware for authentication, etc
 * This also also allows us to specify a path for the GraphQL endpoint
 */

server.applyMiddleware({
  app,
  path
});
app.listen({
  host,
  port,
  path
}, () => {
  console.log(`GraphQL server ready at http://${host}:${port}${path}`);
});