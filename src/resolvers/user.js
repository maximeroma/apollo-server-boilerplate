export default {
  Query: {
    users: async (parent, args, { models }) => {
      return await models.User.findAll()
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findById(id)
    },
    me: async (parent, { id }, { me, models }) => {
      if (!me) {
        return null
      }
      return await models.User.findById(me.id)
    }
  },

  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id
        }
      })
    }
  }
}
