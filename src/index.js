import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import http from 'http'
import schemas from './schemas'
import resolvers from './resolvers'
import models, { sequelize } from './models'

const app = express()
const eraseDatabaseOnSync = true
app.use(cors())

const getMe = async req => {
  const token = req.headers['x-token']

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET)
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.')
    }
  }
}

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  formatError: error => {
    const message = error.message.replace('SequelizeValidationError: ', '')
    // .replace('Validation error: ', '')

    return {
      ...error,
      message
    }
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return { models }
    }
    if (req) {
      const me = await getMe(req)
      return {
        models,
        me,
        secret: process.env.SECRET
      }
    }
  }
})

server.applyMiddleware({ app, path: '/graphql' })
const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUserWithMessages(new Date())
  }
  httpServer.listen({ port: 8000 }, () =>
    console.log('Apollo server on port 8000')
  )
})

const createUserWithMessages = async date => {
  await models.User.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'rwieruch',
      role: 'ADMIN',
      messages: [
        {
          text: 'Published the Road to learn React',
          createdAt: date.setSeconds(date.getSeconds() + 1)
        }
      ]
    },
    {
      include: [models.Message]
    }
  )

  await models.User.create(
    {
      username: 'ddavids',
      email: 'hello@david.com',
      password: 'ddavids',
      role: 'ADMIN',
      messages: [
        {
          text: 'Happy to release ...',
          createdAt: date.setSeconds(date.getSeconds() + 1)
        },
        {
          text: 'Published a complete ...',
          createdAt: date.setSeconds(date.getSeconds() + 1)
        }
      ]
    },
    {
      include: [models.Message]
    }
  )
}
