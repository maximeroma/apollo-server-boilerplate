import express from 'express'
import cors from 'cors'
import { ApolloServer, gql } from 'apollo-server-express'

const app = express()

app.use(cors())

let users = {
  1: { id: '1', firstname: 'Maxime', lastname: 'Roma', messageIds: [1] },
  2: { id: '2', firstname: 'Dave', lastname: 'Davids', messageIds: [2] }
}

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '2'
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2'
  }
}

const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User

    messages: [Message!]
    message(id: ID!): Message!
  }
  type User {
    id: ID!
    username: String!
    firstname: String!
    lastname: String!
    message: [Message!]
  }
  type Message {
    id: ID!
    text: String!
    user: User!
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
    },
    messages: () => Object.values(messages),
    message: (parent, { id }) => messages[id]
  },

  User: {
    username: user => `${user.firstname} ${user.lastname}`,
    message: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id
      )
    }
  },

  Message: {
    user: message => {
      return users[message.userId]
    }
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
