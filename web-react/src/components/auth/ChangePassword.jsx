import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useParams } from 'react-router'
import jwt_decode from 'jwt-decode'
import { ChangePasswordMutation } from './api'
import styles from '../../css/changePassword.module.css'

function ChangePassword() {
  let { token } = useParams()
  const [username, setUsername] = useState()
  const [userId, setUserId] = useState()
  const [emailId, setEmailId] = useState()
  const [newpassword, setNewPassword] = useState('')
  const [ierror, setIerror] = useState(false)
  const [incorrectpassword, setIncorrectPassword] = useState(false)
  let errorMessage = "The password you entered doesn't match"
  let inputError
  let inputErrorMessage

  let decodedToken
  useEffect(() => {
    decodedToken = jwt_decode(token)
    setUsername(decodedToken.username)
    setUserId(decodedToken.userId)
    setEmailId(decodedToken.emailId)
    console.log(userId, username, emailId)
  })
  const checkpassword = () => {
    var password1 = document.getElementById('password')
    var password2 = document.getElementById('confirm_password')
    if (password2.value) {
      if (password1.value != password2.value) {
        setIerror(true)
        setIncorrectPassword(true)
        errorMessage = "Passwords Don't Match"
        document.getElementById('submitbtn').disabled = true
        document.getElementById('submitbtn').className = styles.buttondisabled
      } else {
        setIerror(false)
        setIncorrectPassword(false)
        setNewPassword(password2.value)
        document.getElementById('submitbtn').disabled = false
        document.getElementById('submitbtn').className = styles.button
      }
    }
    console.log(password2.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ierror) {
      changepassword({
        variables: {
          userId: userId,
          password: newpassword,
        },
      })
    }
  }

  const [changepassword] = useMutation(ChangePasswordMutation, {
    onCompleted: (data) => {
      console.log(data.changepassword.token)
      alert('Password Changed Successfully')
      window.location.href = '/'
    },
  })

  if (ierror) {
    inputError = {
      border: '2px solid red',
    }
    inputErrorMessage = {
      color: 'red',
    }
  }
  if (incorrectpassword) {
    errorMessage = "The password you entered doesn't match"
  }
  return (
    <div className={styles.main_div}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.heading_div}>
            <p className={styles.heading}>Change Password</p>
            <p className={styles.p}>
              Type and confirm a secure new password
              <br />
              for the account.
            </p>
          </div>
          <div className={styles.form_div}>
            <p className={styles.input_error_p} style={inputErrorMessage}>
              {errorMessage}
            </p>
            <input
              type="password"
              placeholder="New Password"
              id="password"
              className={styles.input}
              style={inputError}
              minLength={8}
              onChange={checkpassword}
              require
            />
            <br />
            <input
              type="password"
              placeholder="Confirm New Password"
              id="confirm_password"
              onChange={checkpassword}
              className={styles.input}
              minLength={8}
              style={inputError}
              required
            />
            <br />

            <input
              type="submit"
              value="Change Password"
              id="submitbtn"
              className={styles.buttondisabled}
            />
            <hr className={styles.hr_line} />
            <p className={styles.p}>
              Want an account here?
              <a href="/Register" className={styles.link}>
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
