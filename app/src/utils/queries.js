import { gql } from '@apollo/client';

// 1. Check active Admin profile status
export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
    }
  }
`;

// 2. Fetch all chatbot leads for your private dashboard
export const GET_ALL_SUBMISSIONS = gql`
  query getAllSubmissions {
    getAllSubmissions {
      _id
      name
      email
      phone
      type
      message
      resumeUrl
      location
      preferredContact
      createdAt
    }
  }
`;

// 3. Fetch all consulting articles for your Blog feed
export const GET_ALL_BLOGS = gql`
  query getAllBlogs {
    getAllBlogs {
      _id
      title
      summary
      content
      imageUrl
      createdAt
      author {
        username
      }
    }
  }
`;

// 4. Fetch all available job postings for your Career board
export const GET_ALL_JOBS = gql`
  query getAllJobs {
    getAllJobs {
      _id
      title
      companyName
      description
      requirements
      location
      salaryRange
      imageUrl
      createdAt
    }
  }
`;
