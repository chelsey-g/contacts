/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createContact = /* GraphQL */ `
  mutation CreateContact(
    $input: CreateContactInput!
    $condition: ModelContactConditionInput
  ) {
    createContact(input: $input, condition: $condition) {
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
export const updateContact = /* GraphQL */ `
  mutation UpdateContact(
    $input: UpdateContactInput!
    $condition: ModelContactConditionInput
  ) {
    updateContact(input: $input, condition: $condition) {
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
export const deleteContact = /* GraphQL */ `
  mutation DeleteContact(
    $input: DeleteContactInput!
    $condition: ModelContactConditionInput
  ) {
    deleteContact(input: $input, condition: $condition) {
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
