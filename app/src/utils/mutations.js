// src/utils/mutations.js
import { gql } from '@apollo/client';

export const SUBMIT_INQUIRY = gql`
  mutation SubmitInquiry(
    $name: String!
    $email: String!
    $phone: String
    $type: String!
    $message: String!
    $resumeUrl: String
    $location: String
    $preferredContact: String
  ) {
    submitInquiry(
      name: $name
      email: $email
      phone: $phone
      type: $type
      message: $message
      resumeUrl: $resumeUrl
      location: $location
      preferredContact: $preferredContact
    ) {
      _id
      name
      type
    }
  }
`;
