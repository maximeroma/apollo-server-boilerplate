import { GraphQLDateTime } from 'graphql-iso-date'
import messageResolver from './message'
import userResolver from './user'

const customScalarResolver = {
  Date: GraphQLDateTime
}

export default [customScalarResolver, userResolver, messageResolver]
