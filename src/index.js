import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import schemas from './schemas'
import resolvers from './resolvers'
import models from './models'

const app = express()

app.use(cors())

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  context: {
    models,
    me: models.users[1]
  }
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen({ port: 8000 }, () => console.log('Apollo server on port 8000'))
