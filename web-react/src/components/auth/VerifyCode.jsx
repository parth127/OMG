import React, { Component } from 'react'

import styles from '../../css/forgot.module.css'

class VerifyCode extends Component {
  render() {
    return (
      <div className={styles.main_div}>
        <div className={styles.card}>
          <form action="/ChangePassword">
            <div className={styles.heading_div}>
              <p className={styles.heading}>Verify code</p>
              <p className={styles.p}>
                We just sent a verification code to your email.
              </p>
            </div>
            <div className={styles.input_form_div}>
              <input
                type="number"
                placeholder="Code"
                className={styles.input}
              />
              <br />
              <input type="submit" value="Verify" className={styles.button} />
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
}

export default VerifyCode
