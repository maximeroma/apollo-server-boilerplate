import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import schemas from './schemas'
import resolvers from './resolvers'
import models, { sequelize } from './models'

const app = express()
console.log('hello1', process.env.DATABASE)
app.use(cors())

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  context: {
    models,
    me: models.users
  }
})

server.applyMiddleware({ app, path: '/graphql' })

sequelize
  .sync()
  //   // .sync({ force: true })
  //   // .authenticate()
  //   // .then(() => {
  //   //   console.log('Connection has been established successfully.')
  //   // })
  //   // .catch(err => {
  //   //   console.error('Unable to connect to the database:', err)
  //   // })
  .then(async () => {
    app.listen({ port: 8000 }, () => console.log('Apollo server on port 8000'))
  })
