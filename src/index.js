import express from 'express'
import cors from 'cors'
import { ApolloServer, gql } from 'apollo-server-express'

const app = express()

app.use(cors())

let users = {
  1: { id: '1', firstname: 'Maxime', lastname: 'Roma' },
  2: { id: '2', firstname: 'Dave', lastname: 'Davids' }
}

const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User
  }
  type User {
    id: ID!
    username: String!
    firstname: String!
    lastname: String!
  }
`
const resolvers = {
  Query: {
    users: () => {
      return Object.values(users)
    },
    me: (parent, args, { me }) => {
      return me
    },
    user: (parent, { id }) => {
      return users[id]
    }
  },

  User: {
    username: user => `${user.firstname} ${user.lastname}`
  }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1]
  }
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen({ port: 8000 }, () => console.log('Apollo server on port 8000'))
