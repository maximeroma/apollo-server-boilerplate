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

export default { messages, users }
