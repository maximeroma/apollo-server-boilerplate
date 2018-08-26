import uuidv4 from 'uuid/v4'

export default {
  Query: {
    messages: (parent, args, { models }) => Object.values(models.messages),
    message: (parent, { id }, { models }) => models.messages[id]
  },

  Message: {
    user: (message, args, { models }) => {
      return models.users[message.userId]
    }
  },

  Mutation: {
    createMessage: (mutation, { text }, { me, models }) => {
      const id = uuidv4()
      const message = {
        id,
        text,
        userId: me.id
      }

      models.messages[id] = message
      models.users[me.id].messageIds.push(id)
    },
    deleteMessage: (parent, { id }, { models }) => {
      const { [id]: message, ...otherMessages } = models.messages

      if (!message) {
        return false
      }
      models.messages = otherMessages
      return true
    }
  }
}
