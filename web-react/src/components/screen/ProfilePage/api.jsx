import { gql } from '@apollo/client'

const FetchMyDetails = gql`
  query($userId: ID!) {
    User(userId: $userId) {
      userId
      username
      name
      emailId
      city
      province
      bio
      noOfFriends
      profilePicture
      coverPicture
      noOfFriendRequest
    }
  }
`

const FetchUserDetails = gql`
  query($username: String!) {
    User(username: $username) {
      userId
      username
      name
      emailId
      city
      province
      bio
      noOfFriends
      profilePicture
      coverPicture
    }
  }
`

const UpdateProfilePicture = gql`
  mutation($userId: ID!, $profilePicture: String) {
    UpdateUser(userId: $userId, profilePicture: $profilePicture) {
      userId
    }
  }
`

const UpdateCoverPicture = gql`
  mutation($userId: ID!, $coverPicture: String) {
    UpdateUser(userId: $userId, coverPicture: $coverPicture) {
      userId
    }
  }
`

const UpdateProfile = gql`
  mutation(
    $userId: ID!
    $name: String
    $dateOfBirth: String
    $gender: String
    $city: String
    $province: String
    $bio: String
  ) {
    UpdateUser(
      userId: $userId
      name: $name
      dateOfBirth: $dateOfBirth
      gender: $gender
      city: $city
      province: $province
      bio: $bio
    ) {
      userId
    }
  }
`

const CreateFriendRequest = gql`
  mutation($requestId: ID!, $timeStamp: String) {
    CreateFriendRequest(requestId: $requestId, timeStamp: $timeStamp) {
      requestId
    }
  }
`

const CreateRequestFrom = gql`
  mutation($requestId: ID!, $userId: ID!) {
    AddFriendRequestFrom(
      from: { userId: $userId }
      to: { requestId: $requestId }
    ) {
      to {
        requestId
      }
    }
  }
`

const CreateRequestTo = gql`
  mutation($requestId: ID!, $userId: ID!) {
    AddFriendRequestTo(
      to: { userId: $userId }
      from: { requestId: $requestId }
    ) {
      from {
        requestId
      }
    }
  }
`

const DeleteFriendRequest = gql`
  mutation($requestId: ID!) {
    DeleteFriendRequest(requestId: $requestId) {
      requestId
    }
  }
`

const AddFriend = gql`
  mutation($from: ID!, $to: ID!) {
    AddUserFriends(from: { userId: $from }, to: { userId: $to }) {
      from {
        userId
      }
    }
  }
`

const FetchIsRequested = gql`
  query($from: ID!, $to: ID!) {
    FriendRequest(filter: { from: { userId: $from }, to: { userId: $to } }) {
      requestId
      timeStamp
      from {
        userId
        username
      }
      to {
        userId
        username
      }
    }
  }
`

const DeleteRequest = gql`
  mutation($requestId: ID!) {
    DeleteFriendRequest(requestId: $requestId) {
      requestId
    }
  }
`

const CheckIsFriends = gql`
  query($from: ID!, $to: ID!) {
    User(userId: $from) {
      userId
      username
      friends(filter: { userId: $to }) {
        userId
        username
      }
    }
  }
`

const GetPostByUser = gql`
  query($username: String!) {
    User(username: $username) {
      posts {
        postId
        text
        img
        date
        likes
        numComments
        commentIsDisabled
        user {
          userId
          username
          name
          profilePicture
        }
      }
    }
  }
`

const GetMyFriendRequest = gql`
  query($userId: ID!) {
    FriendRequest(orderBy: timeStamp_desc) {
      requestId
      from {
        userId
        username
        name
        profilePicture
      }
      to(filter: { userId: $userId }) {
        userId
      }
    }
  }
`

const GetMyFriends = gql`
  query($userId: ID!) {
    User(userId: $userId) {
      friends {
        userId
        username
        name
        profilePicture
      }
    }
  }
`

const RemoveFriend = gql`
  mutation($from: ID!, $to: ID!) {
    RemoveUserFriends(from: { userId: $from }, to: { userId: $to }) {
      from {
        userId
      }
    }
  }
`

export {
  FetchMyDetails,
  FetchUserDetails,
  UpdateProfilePicture,
  UpdateCoverPicture,
  UpdateProfile,
  CreateFriendRequest,
  CreateRequestFrom,
  CreateRequestTo,
  DeleteFriendRequest,
  AddFriend,
  FetchIsRequested,
  DeleteRequest,
  CheckIsFriends,
  GetPostByUser,
  GetMyFriendRequest,
  GetMyFriends,
  RemoveFriend,
}
