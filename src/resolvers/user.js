export default {
  Query: {
    users: (parent, args, { models }) => {
      return Object.values(models.users)
    },
    me: (parent, args, { me }) => {
      return me
    },
    user: (parent, { id }, { models }) => {
      return models.users[id]
    }
  },

  User: {
    username: user => `${user.firstname} ${user.lastname}`
  }
}
