import { gql } from '@apollo/client';

// 1. Core mutation fired automatically by your React ChatBot
export const SUBMIT_INQUIRY = gql`
  mutation submitInquiry(
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

// 2. Fallback traditional administrator login link
export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// 3. Publish a new media-rich article to your Blog
export const CREATE_BLOG = gql`
  mutation createBlog($title: String!, $content: String!, $summary: String, $imageUrl: String) {
    createBlog(title: $title, content: $content, summary: $summary, imageUrl: $imageUrl) {
      _id
      title
    }
  }
`;

// 4. Publish a fresh job opening onto your Career Board
export const CREATE_JOB = gql`
  mutation createJob(
    $title: String!
    $companyName: String!
    $description: String!
    $requirements: String
    $location: String!
    $salaryRange: String
    $imageUrl: String
  ) {
    createJob(
      title: $title
      companyName: $companyName
      description: $description
      requirements: $requirements
      location: $location
      salaryRange: $salaryRange
      imageUrl: $imageUrl
    ) {
      _id
      title
      companyName
    }
  }
`;

export const CREATE_TESTIMONIAL = gql`
  mutation CreateTestimonial($clientName: String!, $company: String!, $role: String, $quote: String!, $rating: Int, $imageUrl: String) {
    createTestimonial(clientName: $clientName, company: $company, role: $role, quote: $quote, rating: $rating, imageUrl: $imageUrl) {
      _id
      clientName
      company
      role
      quote
      rating
    }
  }
`;
