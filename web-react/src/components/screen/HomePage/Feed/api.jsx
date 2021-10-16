import { gql } from '@apollo/client'

const createPost = gql`
  mutation(
    $postId: ID!
    $text: String!
    $date: String!
    $img: String
    $likes: Int
    $hashtag: [String]
    $commentIsDisabled: Boolean
  ) {
    CreatePost(
      postId: $postId
      text: $text
      date: $date
      img: $img
      likes: $likes
      hashtag: $hashtag
      commentIsDisabled: $commentIsDisabled
    ) {
      postId
    }
  }
`
const createSentiment = gql`
  mutation($sentimentId: ID!, $sentiment: [String]) {
    CreateSentiment(sentimentId: $sentimentId, sentiment: $sentiment) {
      sentimentId
    }
  }
`

const createPostSentimentRelation = gql`
  mutation($from: _PostInput!, $to: _SentimentInput!) {
    AddSentimentPost(from: $from, to: $to) {
      from {
        postId
      }
    }
  }
`

const CreateUserPostRelation = gql`
  mutation($from: _UserInput!, $to: _PostInput!) {
    AddUserPosts(from: $from, to: $to) {
      to {
        postId
      }
    }
  }
`
const GetPost = gql`
  query($postId: ID!) {
    Post(postId: $postId) {
      postId
      text
      img
      date
      likes
      commentIsDisabled
      numComments
      user {
        userId
        username
        name
        profilePicture
      }
    }
  }
`

const GetMyFriendsPost = gql`
  query($userId: ID!) {
    myFriendsPost(userId: $userId) {
      ... on Post {
        postId
        text
        img
        date
        likes
        commentIsDisabled
        numComments
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

const IsLikedByME = gql`
  query($postId: ID!, $userId: ID!) {
    Post(postId: $postId) {
      text
      date
      likedBy(filter: { userId: $userId }) {
        userId
        username
      }
    }
  }
`

const AddLike = gql`
  mutation($userId: ID!, $postId: ID!) {
    AddPostLikedBy(from: { userId: $userId }, to: { postId: $postId }) {
      to {
        postId
      }
    }
  }
`

const UnLike = gql`
  mutation($userId: ID!, $postId: ID!) {
    RemovePostLikedBy(from: { userId: $userId }, to: { postId: $postId }) {
      to {
        postId
      }
    }
  }
`

const UpdateLike = gql`
  mutation($postId: ID!, $likes: Int) {
    UpdatePost(postId: $postId, likes: $likes) {
      postId
    }
  }
`

const FetchMyDetails = gql`
  query($userId: ID!) {
    User(userId: $userId) {
      userId
      username
      name
      profilePicture
    }
  }
`

const AddNewComment = gql`
  mutation($commentId: ID!, $text: String, $date: String) {
    CreateComment(commentId: $commentId, text: $text, date: $date) {
      commentId
    }
  }
`

const AddPostComment = gql`
  mutation($commentId: ID!, $postId: ID!) {
    AddPostComments(from: { commentId: $commentId }, to: { postId: $postId }) {
      from {
        commentId
      }
    }
  }
`

const AddUserComment = gql`
  mutation($userId: ID!, $commentId: ID!) {
    AddUserComments(from: { userId: $userId }, to: { commentId: $commentId }) {
      to {
        commentId
      }
    }
  }
`

const FetchAllComments = gql`
  query($postId: ID!) {
    Post(postId: $postId) {
      user {
        userId
      }
      comments {
        commentId
        text
        date
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

const DeleteComment = gql`
  mutation($commentId: ID!) {
    DeleteComment(commentId: $commentId) {
      commentId
    }
  }
`

const DeletePost = gql`
  mutation($postId: ID!) {
    DeletePost(postId: $postId) {
      postId
    }
  }
`

const GetHashtagFeed = gql`
  query($hashtag: [String!]) {
    Post(orderBy: date_desc, filter: { hashtag_contains: $hashtag }) {
      postId
      text
      img
      date
      likes
      commentIsDisabled
      numComments
      user {
        userId
        username
        name
        profilePicture
      }
    }
  }
`

const GetPostSentiment = gql`
  query($postId: ID!) {
    Post(postId: $postId) {
      postId
      text
      img
      date

      user {
        userId
        username
        name
        profilePicture
      }
      sentiment {
        sentimentId
        sentiment
      }
    }
  }
`

export {
  createPost,
  CreateUserPostRelation,
  GetPost,
  IsLikedByME,
  AddLike,
  UnLike,
  UpdateLike,
  FetchMyDetails,
  AddNewComment,
  AddPostComment,
  AddUserComment,
  FetchAllComments,
  DeleteComment,
  DeletePost,
  GetHashtagFeed,
  createSentiment,
  createPostSentimentRelation,
  GetPostSentiment,
  GetMyFriendsPost,
}
