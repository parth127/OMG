/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
} from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context'
//import { ApolloLink } from 'apollo-boost'
import { onError } from 'apollo-link-error'

const httpLink = createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_URI || '/graphql',
})
const authLink = setContext((_, { headers }) => {
  // get the authentication token from session storage if it exists
  const token = localStorage.getItem('token')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})
const errorLink = onError(({ graphQLErrors, networkErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
  if (networkErrors) networkErrors.map(({ message }) => console.log(message))
})

const client = new ApolloClient({
  // eslint-disable-next-line no-undef
  link: ApolloLink.from([errorLink, authLink, httpLink]),

  cache: new InMemoryCache(),
  onError: (e) => {
    console.log(e)
  },
})

const Main = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

ReactDOM.render(<Main />, document.getElementById('root'))
registerServiceWorker()
