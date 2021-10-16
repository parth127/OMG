import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import styles from '../../css/forgot.module.css'
import emailjs from 'emailjs-com'
import jwt_decode from 'jwt-decode'
import { ForgotPasswordMutation } from './api'
import Snackbar from '@material-ui/core/Snackbar'

function ForgotPassword() {
  let errorMessage =
    "The Email ID that you've entered \n doesn't match any account."

  const [inputEmail, setInputEmail] = useState('')
  const [email, setToEmail] = useState('')
  const [ierror, setIerror] = useState(false)

  const [redirect, setRedirect] = useState(false)
  const [forgottoken, setForgotToken] = useState('')
  const [noEmail, setNoEmail] = useState(false)
  let inputError
  let inputErrorMessage

  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  })

  const { vertical, horizontal, open } = state

  const handleClick = () => {
    setState({ ...state, open: true })
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  if (ierror) {
    inputError = {
      border: '2px solid red',
    }
    inputErrorMessage = {
      color: 'red',
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    forgotpassword({
      variables: {
        emailId: inputEmail,
      },
    })
    setToEmail(inputEmail)
    setInputEmail('')
  }

  var templateParams

  function sendEmail() {
    emailjs
      .send(
        'service_resz60p',
        'template_6h8k02a',
        templateParams,
        'user_3naJ55UiZmZVlymRq56mR'
      )
      .then(
        (result) => {
          console.log(result.text)
        },
        (error) => {
          console.log(error.text)
        }
      )
  }

  const [forgotpassword] = useMutation(ForgotPasswordMutation, {
    onCompleted: (data) => {
      console.log(data.forgotpassword.token)

      setForgotToken(data.forgotpassword.token)

      console.log(forgottoken)
      let decodedToken

      decodedToken = jwt_decode(data.forgotpassword.token)

      console.log(decodedToken.username)

      templateParams = {
        email: email,
        link: 'http://localhost:3000/ChangePassword/',
        token: data.forgotpassword.token,
        username: decodedToken.username,
      }
      sendEmail()
      handleClick()
      //alert('The link to reset your password has been sent to your email.')
      //window.location.href = '/'

      setRedirect(true)
      //window.location.reload(false)
    },
    onError: (error) => {
      if (error) {
        setNoEmail(true)

        console.log('Email Not Found')
      }
      setIerror(true)
    },
  })
  console.log(forgottoken)
  console.log(email)
  if (noEmail) {
    errorMessage =
      "The Email ID that you've entered \n doesn't match any account."
  }
  if (redirect) {
    // return <Redirect to="/" />
  }
  return (
    <div className={styles.main_div}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.heading_div}>
            <p className={styles.heading}>Recover Password</p>
            <p className={styles.p}>
              Enter your email to receive the verification link.
            </p>
          </div>
          <div className={styles.input_form_div}>
            <p className={styles.input_error_p} style={inputErrorMessage}>
              {errorMessage}
            </p>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              style={inputError}
              onChange={(e) => setInputEmail(e.target.value)}
              required
            />
            <br />
            <input type="submit" value="Send Link" className={styles.button} />
            <hr className={styles.hr_line} />
            <p className={styles.p}>
              Want an account here?
              <a href="/Register" className={styles.link}>
                Sign up
              </a>
            </p>
          </div>
        </form>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message="The link to reset your password has been sent to your email."
          key={vertical + horizontal}
          severity="success"
        />
      </div>
    </div>
  )
}

export default ForgotPassword
