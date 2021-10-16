import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './components/auth/Login.jsx'
import ForgotPassword from './components/auth/ForgotPassword'
import VerifyCode from './components/auth/VerifyCode'
import ChangePassword from './components/auth/ChangePassword'
import Register from './components/auth/Register'

import HomePage from './components/screen/HomePage/HomePage'
import MyProfile from './components/screen/ProfilePage/MyProfile'
import UserProfile from './components/screen/ProfilePage/UserProfile'
import ViewSentiment from './components/screen/HomePage/Feed/ViewSentiment'
import Opinion from './Opinion'
import ViewSinglePost from './components/screen/HomePage/Feed/ViewSinglePost'
import Hashtag from './components/screen/HomePage/Feed/Hashtag.jsx'

function setToken(userToken) {
  localStorage.setItem('token', userToken)
}
function getToken() {
  const tokenString = localStorage.getItem('token')

  return tokenString
}

function App() {
  const token = getToken()

  if (!token) {
    return (
      <div
        style={{
          height: '100vh',
          position: 'fixed',
          width: '100%',
          overflowY: 'hidden',
        }}
      >
        <Router>
          <Switch>
            <Route exact path="/Register">
              <Register />
            </Route>
            <Route exact path="/ForgotPassword">
              <ForgotPassword />
            </Route>
            <Route exact path="/VerifyCode">
              <VerifyCode />
            </Route>
            <Route exact path="/ChangePassword/:token">
              <ChangePassword />
            </Route>
            <Route>
              <Login setToken={setToken} />
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/profile/:account">
          <UserProfile />
        </Route>
        <Route exact path="/profile">
          <MyProfile />
        </Route>
        <Route exact path="/profile/view/:ViewPage">
          <MyProfile />
        </Route>
        <Route exact path="/hashtag/:hashtag">
          <Hashtag />
        </Route>
        <Route exact path="/sentiment/post/:postId">
          <ViewSentiment />
        </Route>
        <Route exact path="/opinion">
          <Opinion />
        </Route>
        <Route exact path="/post/:postId">
          <ViewSinglePost />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
