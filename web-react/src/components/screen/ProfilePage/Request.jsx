import { useQuery, useMutation } from '@apollo/client'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from '../../../css/requestList.module.css'
import { GetMyFriendRequest, AddFriend, DeleteRequest } from './api'
import Button from '@material-ui/core/Button'

function Request({ myId }) {
  const [requestList, setRequestList] = useState([])

  const { data, error, loading } = useQuery(GetMyFriendRequest, {
    variables: {
      userId: myId,
    },
  })

  useEffect(() => {
    if (data) {
      console.log(data.FriendRequest)
      setRequestList(data.FriendRequest)
    }
    if (error) {
      console.log(error)
    }
    if (loading) {
      console.log(loading)
    }
  }, [data])

  const [deleteRequest] = useMutation(DeleteRequest, {
    onCompleted: () => {
      window.location.reload(false)
    },
  })

  const [addFriendOut] = useMutation(AddFriend)

  const [addFriend] = useMutation(AddFriend)

  const handleAcceptRequest = (e, userId, requestId) => {
    e.preventDefault()
    addFriend({
      variables: {
        from: userId,
        to: myId,
      },
    })
    addFriendOut({
      variables: {
        from: myId,
        to: userId,
      },
    })
    deleteRequest({
      variables: {
        requestId: requestId,
      },
    })
  }

  const handleDeleteRequest = (e, requestId) => {
    e.preventDefault()
    deleteRequest({
      variables: {
        requestId: requestId,
      },
    })
  }

  return (
    <div className={styles.container}>
      <h4>Friend Requests</h4>
      <div className={styles.sub_container}>
        {requestList.map((val) => {
          return val.to === null ? (
            ''
          ) : (
            <div key={val.requestId} className={styles.request}>
              <a
                href={'/profile/' + val.from.username}
                style={{
                  textDecoration: 'none',
                  width: 'auto',
                  maxWidth: 'fit-content',
                }}
              >
                <div className={styles.user}>
                  <img
                    className={styles.userProfile}
                    src={
                      val.from.profilePicture === null
                        ? window.location.origin +
                          '/img/defaultProfilePicture.jpeg'
                        : val.from.profilePicture
                    }
                  />
                  <h4 className={styles.username}>
                    {val.from.name === null ? val.from.username : val.from.name}
                  </h4>
                </div>
              </a>
              <div className={styles.action}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) =>
                    handleAcceptRequest(e, val.from.userId, val.requestId)
                  }
                  style={{ margin: '8px' }}
                >
                  Confirm Request
                </Button>
                <Button
                  variant="contained"
                  color="default"
                  style={{ margin: '8px' }}
                  onClick={(e) => handleDeleteRequest(e, val.requestId)}
                >
                  Delete Request
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Request
