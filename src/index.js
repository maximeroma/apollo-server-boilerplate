import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
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
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '')

    return {
      ...error,
      message
    }
  },
  context: async ({ req }) => {
    const me = await getMe(req)
    return {
      models,
      me,
      secret: process.env.SECRET
    }
  }
})

server.applyMiddleware({ app, path: '/graphql' })

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUserWithMessages()
  }
  app.listen({ port: 8000 }, () => console.log('Apollo server on port 8000'))
})

const createUserWithMessages = async () => {
  await models.User.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'rwieruch',
      role: 'ADMIN',
      messages: [
        {
          text: 'Published the Road to learn React'
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
      messages: [
        {
          text: 'Happy to release ...'
        },
        {
          text: 'Published a complete ...'
        }
      ]
    },
    {
      include: [models.Message]
    }
  )
}
