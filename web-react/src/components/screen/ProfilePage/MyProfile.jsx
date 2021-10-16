import React from 'react'
import styles from '../../../css/userprofile.module.css'
import CameraAltIcon from '@material-ui/icons/CameraAlt'
import MyIntro from './MyIntro'
import Request from './Request'
import { useQuery } from '@apollo/client'
import { FetchMyDetails } from './api'
import { useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import { useState } from 'react'
import ProfilePicture from './ProfilePicture'
import CoverPicture from './CoverPicture'
import HeaderComponent from '../HomePage/HeaderComponent'
import PostList from './PostList'
import Badge from '@material-ui/core/Badge'
import FriendList from './FriendList'
import { useParams } from 'react-router'

function MyProfile() {
  let decodedToken = jwt_decode(localStorage.getItem('token'))
  let myId = decodedToken.userId

  let { ViewPage } = useParams()
  const [profileTrigger, setProfileTrigger] = useState(false)
  const [coverTrigger, setCoverTrigger] = useState(false)

  const [intro, setIntro] = useState(ViewPage == undefined ? true : false)
  const [request, setRequest] = useState(ViewPage == 'request' ? true : false)
  const [friendList, setFriendList] = useState(
    ViewPage == 'friends' ? true : false
  )

  const { data } = useQuery(FetchMyDetails, {
    variables: {
      userId: myId,
    },
  })

  const [myData, setMyData] = useState([])

  useEffect(() => {
    if (data) {
      setMyData(data.User[0])
    }
  }, [data])

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
                  myData.coverPicture == null
                    ? 'img/defaultCoverPicture.png'
                    : myData.coverPicture
                })`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              <div className={styles.profile_pic_div}>
                <img
                  style={{ userSelect: 'none' }}
                  className={styles.profile_pic}
                  src={
                    myData.profilePicture == null
                      ? window.location.origin +
                        '/img/defaultProfilePicture.jpeg'
                      : myData.profilePicture
                  }
                />
                <button
                  onClick={() => {
                    setProfileTrigger(true)
                  }}
                >
                  <CameraAltIcon />
                </button>
                <ProfilePicture
                  trigger={profileTrigger}
                  setTrigger={setProfileTrigger}
                  myId={myId}
                />
              </div>
              <div className={styles.cover_picture_edit_div}>
                <button
                  onClick={() => {
                    setCoverTrigger(true)
                  }}
                >
                  <CameraAltIcon />
                  Edit
                </button>
                <CoverPicture
                  trigger={coverTrigger}
                  setTrigger={setCoverTrigger}
                  myId={myId}
                />
              </div>
            </div>
            <h4 className={styles.user_name_h4}>{myData.name}</h4>
            <p>{myData.bio}</p>
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
                      setRequest(false)
                      setFriendList(false)
                    }}
                  >
                    <p className={styles.p}>Intro</p>
                  </a>
                </div>
                <div className={styles.option}>
                  <a
                    onClick={() => {
                      setRequest(false)
                      setIntro(false)
                      setFriendList(true)
                    }}
                  >
                    <p className={styles.p}>Friends</p>
                  </a>
                </div>
                <div className={styles.option}>
                  <a
                    onClick={(e) => {
                      e.preventDefault()
                      setRequest(true)
                      setIntro(false)
                      setFriendList(false)
                    }}
                  >
                    <p className={styles.p}>
                      <Badge
                        badgeContent={myData.noOfFriendRequest}
                        color="secondary"
                      >
                        Request
                      </Badge>
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            {intro ? (
              <div className="row">
                <div className="col-4">
                  <MyIntro myData={myData} myId={myId} />
                </div>
                <div className="col-8">
                  <PostList username={myData.username} />
                </div>
              </div>
            ) : request == true ? (
              <Request myId={myId} />
            ) : friendList == true ? (
              <FriendList userId={myId} />
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

export default MyProfile
