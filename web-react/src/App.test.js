import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  cache: new InMemoryCache(),
})

// eslint-disable-next-line no-undef
it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    div
  )
  ReactDOM.unmountComponentAtNode(div)
})
