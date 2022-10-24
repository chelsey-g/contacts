/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getContact = /* GraphQL */ `
  query GetContact($id: ID!) {
    getContact(id: $id) {
      id
      type
      name
      phone_mobile
      phone_home
      phone_work
      email
      address
      city
      state
      zip
      country
      notes
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listContacts = /* GraphQL */ `
  query ListContacts(
    $filter: ModelContactFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        name
        phone_mobile
        phone_home
        phone_work
        email
        address
        city
        state
        zip
        country
        notes
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const contactsByName = /* GraphQL */ `
  query ContactsByName(
    $type: String!
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContactFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contactsByName(
      type: $type
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        name
        phone_mobile
        phone_home
        phone_work
        email
        address
        city
        state
        zip
        country
        notes
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
