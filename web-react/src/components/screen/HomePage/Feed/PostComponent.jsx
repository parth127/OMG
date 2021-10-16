import React, { useState, useEffect } from 'react'
import styles from '../../../../css/feedlistPost.module.css'
import jwt_decode from 'jwt-decode'
import CreatePost from './CreatePost'
import { FetchMyDetails } from './api'
import { useQuery } from '@apollo/client'

function PostComponent() {
  const [username, setUsername] = useState()
  const [userId, setUserId] = useState()
  const [inputMessage, setInputMessage] = useState()
  const [popUpTrigger, setPopUpTrigger] = useState(false)

  const [myData, setMyData] = useState([])

  const { data } = useQuery(FetchMyDetails, {
    variables: {
      userId: userId,
    },
  })

  let decodedToken
  let inputValue
  useEffect(() => {
    decodedToken = jwt_decode(localStorage.getItem('token'))
    setUsername(decodedToken.username)
    setUserId(decodedToken.userId)

    if (typeof data === 'undefined') {
      console.log('')
    } else {
      setMyData(data.User[0])
      if (myData?.name == null) {
        inputValue = "Share what's on your mind, " + username + '!'
      } else {
        inputValue = "Share what's on your mind, " + myData.name + '!'
      }

      setInputMessage(inputValue)
    }
  }, [data])

  return (
    <div className={styles.post_container_div}>
      <div className={styles.post_div}>
        <img
          src={
            myData.profilePicture == null
              ? 'img/defaultProfilePicture.jpeg'
              : myData.profilePicture
          }
          className={styles.profile_picture}
        />
        <input
          type="submit"
          value={inputMessage}
          className={styles.post_button}
          onClick={() => {
            setPopUpTrigger(true)
          }}
        />
        <CreatePost
          trigger={popUpTrigger}
          setTrigger={setPopUpTrigger}
          username={username}
          userId={userId}
          myData={myData}
        />
      </div>
    </div>
  )
}

export default PostComponent
