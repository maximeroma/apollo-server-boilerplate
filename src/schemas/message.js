import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    messages(limit: Int, cursor: String): MessageConnection!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean
  }

  extend type Subscription {
    messageCreated: MessageCreated!
  }

  type MessageCreated {
    message: Message!
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
    createdAt: Date!
  }
`
