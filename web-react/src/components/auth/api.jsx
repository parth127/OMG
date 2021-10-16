import { gql } from '@apollo/client'

const LoginMutation = gql`
  mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`
const SignUp = gql`
  mutation($username: String!, $emailId: String!, $password: String!) {
    signUp(username: $username, emailId: $emailId, password: $password) {
      token
    }
  }
`

const ForgotPasswordMutation = gql`
  mutation($emailId: String!) {
    forgotpassword(emailId: $emailId) {
      token
    }
  }
`

const ChangePasswordMutation = gql`
  mutation($userId: String!, $password: String!) {
    changepassword(userId: $userId, password: $password) {
      token
    }
  }
`

export { LoginMutation, SignUp, ForgotPasswordMutation, ChangePasswordMutation }
