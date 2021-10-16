import React, { useEffect, useState } from 'react'
import styles from '../../../../css/homepage.module.css'
import PostComponent from './PostComponent'
import Post from './Post'
import { useQuery } from '@apollo/client'
//import { GetAllPost } from './api'
import { GetMyFriendsPost } from './api'
import jwt_decode from 'jwt-decode'

function FeedList() {
  const [myId, setMyId] = useState()
  //const { data } = useQuery(GetAllPost)
  const { data } = useQuery(GetMyFriendsPost, {
    variables: {
      userId: myId,
    },
  })
  const [posts, setPosts] = useState([])

  useEffect(() => {
    var decodedToken = jwt_decode(localStorage.getItem('token'))
    setMyId(decodedToken.userId)

    if (data) {
      setPosts(data.myFriendsPost)
    }
  }, [data])

  return (
    <div className={styles.feed_list_component}>
      <div>
        <PostComponent />

        <hr />
        {posts.map((val) => {
          return (
            <div key={val.postId}>
              <Post post_data={val} myId={myId} />
              <br />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FeedList
