import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/client'
import styles from '../../css/landing.module.css'
import { LoginMutation } from './api'
import { Redirect } from 'react-router'

function Login({ setToken }) {
  const [inputUserName, setInputUserName] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const [ierror, setIerror] = useState(false)
  const [noUser, setNoUser] = useState(false)
  const [noPassword, setNoPassword] = useState(false)

  const [login] = useMutation(LoginMutation, {
    onCompleted: (data) => {
      setToken(data.login.token)
      console.log(data.login.token)
      setRedirect(true)
    },
    onError: (error) => {
      if (error.message === 'Authorization Error') {
        setNoPassword(true)
        setNoUser(false)
        console.log('Invalid Password')
      } else {
        setNoUser(true)
        setNoPassword(false)
        console.log('Username not found')
      }
      setIerror(true)
    },
  })

  let errorMessage = 'Invalid \n Credentials'

  const handleSubmit = (e) => {
    e.preventDefault()

    login({
      variables: {
        username: inputUserName,
        password: inputPassword,
      },
    })

    setInputUserName('')
    setInputPassword('')
  }

  let inputError
  let inputErrorMessage

  if (ierror) {
    inputError = {
      border: '2px solid red',
    }
    inputErrorMessage = {
      color: 'red',
    }
  }

  if (noUser) {
    errorMessage =
      "The username that you've entered \n doesn't match any account."
  }
  if (noPassword) {
    errorMessage = ' \n The password you entered is incorrect!'
  }
  if (redirect) {
    window.location.reload(false)
    return <Redirect to="/" />
  }

  return (
    <div className={styles.main_div}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.heading_div}>
            <p className={styles.heading}>Log in</p>
          </div>
          <div className={styles.input_form_div}>
            <p className={styles.input_error_p} style={inputErrorMessage}>
              {errorMessage}
            </p>
            <input
              type="text"
              placeholder="Username"
              style={inputError}
              value={inputUserName}
              required={true}
              onChange={(e) => setInputUserName(e.target.value)}
              className={styles.input}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              required={true}
              value={inputPassword}
              style={inputError}
              onChange={(e) => setInputPassword(e.target.value)}
              className={styles.input}
            />
            <br />
            <div className={styles.link_div}>
              <a href="/ForgotPassword" className={styles.link}>
                Forgot password?
              </a>
            </div>
            <br />
            <input
              type="submit"
              value="Log in"
              className={styles.login_button}
            />
            <hr className={styles.hr_line} />
            <p className={styles.p} style={{ fontWeight: 'lighter' }}>
              Want an account here?
              <a
                href="/Register"
                className={styles.link}
                style={{ fontWeight: 'normal' }}
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
}

export default Login
