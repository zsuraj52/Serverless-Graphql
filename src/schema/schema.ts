import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
type Query {
   testMessage: String
}

type User {
    id: ID
    username: String
    email: String
    password: String
    createdAt: String
    isUpdated: Boolean
}

input createuser {
    username: String
    email: String
    password: String
}

input updateUser {
    username: String
    email: String
    password: String
}


type Query {
    getUsers: [User]
    getUserById(id: ID): User
}


type Mutation {
    createUser(input: createuser): User
    UpdateUser(id:ID! ,input:updateUser):User
    DeleteUser(id:ID!):String
}`;
