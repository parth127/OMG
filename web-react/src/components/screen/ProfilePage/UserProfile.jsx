import React from 'react'
import styles from '../../../css/userprofile.module.css'
import Intro from './Intro'
import { useMutation, useQuery, useLazyQuery } from '@apollo/client'
import { useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import { useState } from 'react'
import { Redirect, useParams } from 'react-router'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import DoneIcon from '@material-ui/icons/Done'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import {
  FetchUserDetails,
  CreateFriendRequest,
  CreateRequestFrom,
  CreateRequestTo,
  FetchIsRequested,
  AddFriend,
  DeleteRequest,
  CheckIsFriends,
  RemoveFriend,
} from './api'
import HeaderComponent from '../HomePage/HeaderComponent'
import PostList from './PostList'
import Button from '@material-ui/core/Button'
import FriendList from './FriendList'

function UserProfile() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  let decodedToken = jwt_decode(localStorage.getItem('token'))
  let myId = decodedToken.userId
  let myUserName = decodedToken.username
  let isRequestedByMe = false
  let hasRequestedMe = false
  let isFriends = false
  let requestId = ''
  const [intro, setIntro] = useState(true)
  const [friendList, setFriendList] = useState(false)

  let { account } = useParams()

  if (account == myUserName) {
    return <Redirect to="/profile" />
  }

  const { data } = useQuery(FetchUserDetails, {
    variables: {
      username: account,
    },
  })

  const [myData, setMyData] = useState([])

  const [getIsRequested, RequestedData] = useLazyQuery(FetchIsRequested)
  const [getHasRequested, HasRequestedData] = useLazyQuery(FetchIsRequested)
  const [checkIsFriends, IsFriendsData] = useLazyQuery(CheckIsFriends)

  useEffect(() => {
    if (data) {
      setMyData(data.User[0])

      getIsRequested({
        variables: {
          from: myId,
          to: data.User[0]?.userId,
        },
      })
      getHasRequested({
        variables: {
          from: data.User[0]?.userId,
          to: myId,
        },
      })
      checkIsFriends({
        variables: {
          from: myId,
          to: data.User[0].userId,
        },
      })
    }
  }, [data])

  if (typeof IsFriendsData.data === 'undefined') {
    isFriends = false
  } else {
    if (IsFriendsData.data.User[0].friends.length === 0) {
      isFriends = false
    } else {
      isFriends = true
    }
  }

  if (typeof RequestedData.data === 'undefined') {
    isRequestedByMe = false
  } else {
    if (RequestedData.data.FriendRequest.length != 0) {
      isRequestedByMe = true
    }
  }

  if (typeof HasRequestedData.data === 'undefined') {
    hasRequestedMe = false
  } else {
    if (HasRequestedData.data.FriendRequest.length != 0) {
      requestId = HasRequestedData.data.FriendRequest[0].requestId
      hasRequestedMe = true
    }
  }

  const [createRequestTo] = useMutation(CreateRequestTo, {
    onCompleted: () => {
      const subscriberId = myData.userId
      let endpoint =
        'https://api.ravenhub.io/company/v0wJhmtlBo/subscribers/' +
        subscriberId +
        '/events/uZseBTlDfk'
      const axios = require('axios').default
      const body = {
        name: myData.username,
        urlVar: '/profile/' + myData.username,
      }
      axios.post(endpoint, body, {
        headers: { 'Content-type': 'application/json' },
      })
      window.location.reload(false)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const [createRequestFrom] = useMutation(CreateRequestFrom, {
    onCompleted: (data) => {
      console.log('Request ID: ' + data.AddFriendRequestFrom.to.requestId)
      console.log('User ID: ' + myData.userId)
      createRequestTo({
        variables: {
          requestId: data.AddFriendRequestFrom.to.requestId,
          userId: myData.userId,
        },
      })
    },
  })

  const [createFriendRequest] = useMutation(CreateFriendRequest, {
    onCompleted: (data) => {
      createRequestFrom({
        variables: {
          requestId: data.CreateFriendRequest.requestId,
          userId: myId,
        },
      })
    },
  })

  const handleAddFriend = (e) => {
    e.preventDefault()
    var rId = uuidv4()
    var curDate = moment().format('MM-DD-YYYY HH:mm:ss')

    createFriendRequest({
      variables: {
        requestId: rId,
        timeStamp: curDate,
      },
    })
  }

  const [deleteRequest] = useMutation(DeleteRequest, {
    onCompleted: () => {
      window.location.reload(false)
    },
  })

  const [addFriendOut] = useMutation(AddFriend, {
    onCompleted: () => {
      deleteRequest({
        variables: {
          requestId: requestId,
        },
      })
    },
  })

  const [addFriend] = useMutation(AddFriend, {
    onCompleted: () => {
      addFriendOut({
        variables: {
          from: myId,
          to: myData.userId,
        },
      })
    },
  })

  const handleAcceptRequest = (e) => {
    e.preventDefault()

    addFriend({
      variables: {
        from: myData.userId,
        to: myId,
      },
    })
  }

  const handleDeleteRequest = (e) => {
    e.preventDefault()
    deleteRequest({
      variables: {
        requestId: requestId,
      },
    })
  }

  const [removeFriend] = useMutation(RemoveFriend)

  const handleRemoveFriend = (e) => {
    e.preventDefault()
    removeFriend({
      variables: {
        from: myId,
        to: myData?.userId,
      },
    })
    removeFriend({
      variables: {
        from: myData?.userId,
        to: myId,
      },
    })
    window.location.reload(false)
  }

  console.log(IsFriendsData.data)

  return (
    <div className={styles.container}>
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">
          <HeaderComponent />
          <div className={styles.sub_container}>
            <div
              className={styles.timeline_pic_div}
              style={{
                boxShadow: '0px 1px 2px rgba(0,0,0,0.2)',
                backgroundImage: `url(${
                  myData?.coverPicture == null
                    ? window.location.origin + '/img/defaultCoverPicture.png'
                    : myData?.coverPicture
                })`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              <div className={styles.profile_pic_div}>
                <img
                  className={styles.profile_pic}
                  src={
                    myData?.profilePicture == null
                      ? window.location.origin +
                        '/img/defaultProfilePicture.jpeg'
                      : myData?.profilePicture
                  }
                />
              </div>
            </div>
            <h4 className={styles.user_name_h4}>
              {myData?.name === null ? myData?.username : myData?.name}
            </h4>
            <p>{myData?.bio}</p>
          </div>
          <div
            style={{
              paddingBottom: '10px',
              borderBottom: '1px solid lightgray',
            }}
          >
            <div className={styles.links}>
              <div className={styles.link_options}>
                <div className={styles.option}>
                  <a
                    onClick={() => {
                      setIntro(true)
                      setFriendList(false)
                    }}
                  >
                    <p className={styles.p}>Intro</p>
                  </a>
                </div>
                <div className={styles.option}>
                  <a
                    onClick={() => {
                      setIntro(false)
                      setFriendList(true)
                    }}
                  >
                    <p className={styles.p}>Friends</p>
                  </a>
                </div>
              </div>
              <div className={styles.friend_request_buttons}>
                <div className={styles.friend_request_button_option}>
                  {isFriends ? (
                    <Button
                      variant="contained"
                      color="default"
                      style={{ margin: '8px' }}
                      onClick={handleRemoveFriend}
                    >
                      Remove Friend
                    </Button>
                  ) : isRequestedByMe ? (
                    <Button
                      variant="contained"
                      color="primary"
                      className="bg-success text-white"
                      style={{ margin: '8px' }}
                      startIcon={<DoneIcon />}
                      disabled
                    >
                      Request Sent
                    </Button>
                  ) : hasRequestedMe ? (
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAcceptRequest}
                        style={{ margin: '8px' }}
                      >
                        Confirm Request
                      </Button>
                      <Button
                        variant="contained"
                        color="default"
                        style={{ margin: '8px' }}
                        onClick={handleDeleteRequest}
                      >
                        Delete Request
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddFriend}
                      style={{ margin: '8px' }}
                      startIcon={<PersonAddIcon />}
                    >
                      Add Friend
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            {intro ? (
              <div className="row">
                <div className="col-4">
                  <Intro myData={myData} />
                </div>
                <div className="col-8">
                  {isFriends ? (
                    <PostList username={account} />
                  ) : (
                    <div className={styles.info_div}>
                      <p style={{ fontWeight: 'bold' }}>
                        {myData?.name === null
                          ? 'You need to  be friends with ' +
                            myData?.username +
                            ' to view their post.'
                          : 'You need to  be friends with ' +
                            myData?.name +
                            ' to view their post.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : friendList ? (
              <FriendList userId={myData.userId} />
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  )
}

export default UserProfile
