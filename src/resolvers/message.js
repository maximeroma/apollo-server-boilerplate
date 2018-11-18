import { ForbiddenError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated, isMessageOwner } from './authorization'
import Sequelize from 'sequelize'

const toCursorHash = string => Buffer.from(string).toString('base64')
const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii')

export default {
  Query: {
    messages: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor)
              }
            }
          }
        : {}
      const messages = await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions
      })

      const hasNextPage = messages.length > limit
      const edges = hasNextPage ? messages.slice(0, -1) : messages

      return {
        edges,
        pageInfo: { endCursor: toCursorHash(edges[edges.length - 1].createdAt) }
      }
    },
    message: async (parent, { id }, { models }) => {
      return await models.Message.findById(id)
    }
  },
  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me, models }) => {
        if (!me) {
          throw new ForbiddenError('Not authenticated as user')
        }

        try {
          return await models.Message.create({
            text,
            userId: me.id
          })
        } catch (error) {
          throw new Error(error)
        }
      }
    ),
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.Message.destroy({ where: { id } })
      }
    )
  },

  Message: {
    user: async (message, args, { models }) => {
      return await models.User.findById(message.userId)
    }
  }
}
