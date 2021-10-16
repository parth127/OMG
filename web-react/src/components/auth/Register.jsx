import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import styles from '../../css/register.module.css'
import { Redirect } from 'react-router-dom'
import { SignUp } from './api'

function Register() {
  const [inputEmail, setInputEmail] = useState('')
  const [inputUserName, setInputUserName] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [isRedirect, setIsRedirect] = useState(false)

  const [signUp] = useMutation(SignUp, {
    onCompleted: () => {
      setIsRedirect(true)
    },
    onError: (error) => {
      if (error.message === 'Authorization Error') {
        console.log('Message:' + error.message)
      } else {
        console.log('Message:' + error.message)
      }
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(inputEmail, inputUserName, inputPassword)

    signUp({
      variables: {
        username: inputUserName,
        emailId: inputEmail,
        password: inputPassword,
      },
    })

    setInputEmail('')
    setInputUserName('')
    setInputPassword('')
  }

  if (isRedirect) {
    return <Redirect to="/" />
  }

  return (
    <div className={styles.main_div}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.heading_div}>
            <img src="img/logo.png" className={styles.logo} />
            <p className={styles.heading}>Welcome to OMG</p>
          </div>
          <div className={styles.input_form_div}>
            <input
              type="email"
              placeholder="Email"
              value={inputEmail}
              required={true}
              onChange={(e) => setInputEmail(e.target.value)}
              className={styles.input}
            />
            <br />
            <input
              type="text"
              placeholder="Username"
              value={inputUserName}
              required={true}
              pattern={'[A-Za-z0-9_]{5,}'}
              onInvalid={'Only use Alphabets, Numbers and Underscore'}
              onChange={(e) => setInputUserName(e.target.value)}
              className={styles.input}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={inputPassword}
              required={true}
              minLength={8}
              onChange={(e) => setInputPassword(e.target.value)}
              className={styles.input}
            />
            <br />
            <p className={styles.terms}>
              By signing up you agree to our Terms and Conditions.
            </p>
            <br />
            <input type="submit" value="Sign up" className={styles.button} />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
