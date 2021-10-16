import { gql } from '@apollo/client'

const SearchUser = gql`
  query($username: String!) {
    User(
      filter: {
        OR: [
          { username_starts_with: $username }
          { name_starts_with: $username }
          { emailId_starts_with: $username }
        ]
      }
    ) {
      userId
      username
      name
      profilePicture
    }
  }
`

const FetchProfilePicture = gql`
  query($userId: ID!) {
    User(userId: $userId) {
      name
      profilePicture
    }
  }
`

const FetchMySentimentActivity = gql`
  query($userId: ID!) {
    User(userId: $userId) {
      posts(first: 10) {
        sentiment {
          sentiment
        }
      }
    }
  }
`

export { SearchUser, FetchProfilePicture, FetchMySentimentActivity }
