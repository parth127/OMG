import React, { useState, useEffect } from 'react'
import styles from '../../../css/leftcomponent.module.css'
import jwt_decode from 'jwt-decode'
import { FetchProfilePicture } from './api'
import { useQuery } from '@apollo/client'
import PeopleIcon from '@material-ui/icons/People'
import PersonAddIcon from '@material-ui/icons/PersonAdd'

function LeftComponent() {
  const [username, setUsername] = useState()
  const [userId, setUserId] = useState()
  const [myData, setMyData] = useState([])
  const { data } = useQuery(FetchProfilePicture, {
    variables: {
      userId: userId,
    },
  })

  let decodedToken
  useEffect(() => {
    decodedToken = jwt_decode(localStorage.getItem('token'))
    setUsername(decodedToken.username)
    setUserId(decodedToken.userId)

    if (data) {
      setMyData(data.User[0])
    }
  }, [data])

  return (
    <div className={styles.left_component}>
      <a href="/profile" className={styles.profile_a}>
        <div className={styles.profile_container_div}>
          <img
            src={
              myData.profilePicture == null
                ? window.location.origin + '/img/defaultProfilePicture.jpeg'
                : myData.profilePicture
            }
            alt="img/defaultProfilePicture.jpeg"
            className={styles.profile_picture}
          />
          <p className={styles.user_name}>
            {myData.name == null ? username : myData.name}
          </p>
        </div>
      </a>
      <div className={styles.options}>
        <div className={styles.option}>
          <a href="/profile/view/friends" style={{ textDecoration: 'none' }}>
            <div className={styles.option_content}>
              <PeopleIcon className={styles.option_icon} />
              <p className={styles.option_p}>Friends</p>
            </div>
          </a>
        </div>
        <div className={styles.option}>
          <a href="/profile/view/request">
            <div className={styles.option_content}>
              <PersonAddIcon className={styles.option_icon} />
              <p className={styles.option_p}>Friend Request</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default LeftComponent
