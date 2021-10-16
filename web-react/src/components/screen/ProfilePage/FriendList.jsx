import { useQuery } from '@apollo/client'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from '../../../css/requestList.module.css'
import { GetMyFriends } from './api'

function FriendList({ userId }) {
  const { data, error, loading } = useQuery(GetMyFriends, {
    variables: {
      userId: userId,
    },
  })

  const [friend, setFriend] = useState([])

  useEffect(() => {
    if (data) {
      console.log(data.User[0].friends)
      setFriend(data.User[0].friends)
    }
    if (loading) {
      console.log()
    }
    if (error) {
      console.log()
    }
  }, [data])

  return (
    <div className={styles.container}>
      <h4>Friends</h4>
      <div className="row">
        {friend.map((val) => {
          return (
            <div
              key={val.userId}
              className="col-6"
              style={{ marginTop: '10px' }}
            >
              <a
                href={'/profile/' + val.username}
                style={{
                  textDecoration: 'none',
                  width: 'auto',
                  maxWidth: 'fit-content',
                }}
              >
                <div
                  className={styles.user}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <img
                    className={styles.userProfile}
                    src={
                      val.profilePicture === null
                        ? window.location.origin +
                          '/img/defaultProfilePicture.jpeg'
                        : val.profilePicture
                    }
                  />
                  <h5 className={styles.username}>
                    {val.name === null ? val.username : val.name}
                  </h5>
                </div>
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FriendList
