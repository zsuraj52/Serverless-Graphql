import { ApolloServer } from 'apollo-server-lambda';
import { resolvers } from './resolver/resolver';
import { typeDefs } from './schema/schema';

const apolloServer = new ApolloServer({ resolvers, typeDefs, formatError: (err) => ({ message: err.message }), });

export const graphqlHandler = apolloServer.createHandler();