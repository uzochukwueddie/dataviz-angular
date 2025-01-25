import { gql } from "apollo-angular";

export const REGISTER_USER = gql`
  mutation RegisterUser($user: Auth!) {
    registerUser(user: $user) {
      user {
        id
        email
      }
      projectIds {
        id
        database
        type
        projectId
      }
      collections
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        id
        email
      }
      projectIds {
        id
        database
        type
        projectId
      }
      collections
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation {
    logout {
      message
    }
  }
`;

export const CHECK_CURRENT_USER = gql`
  mutation CheckCurrentUser {
    checkCurrentUser {
      user {
        id
        email
      }
      projectIds {
        id
        database
        type
        projectId
      }
      collections
    }
  }
`;
