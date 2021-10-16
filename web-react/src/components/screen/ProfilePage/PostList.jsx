import React, { useEffect, useState } from 'react'
import styles from '../../../css/homepage.module.css'
import Post from '../HomePage/Feed/Post'
import { useQuery } from '@apollo/client'
import { GetPostByUser } from './api'
import jwt_decode from 'jwt-decode'

function PostList({ username }) {
  const [myId, setMyId] = useState()
  const [posts, setPosts] = useState([])

  const { error, loading, data } = useQuery(GetPostByUser, {
    variables: {
      username: username,
    },
  })

  useEffect(() => {
    var decodedToken = jwt_decode(localStorage.getItem('token'))
    setMyId(decodedToken.userId)

    if (data) {
      setPosts(data.User[0]?.posts)
    }
    if (error) {
      console.log(error)
    }
    if (loading) {
      console.log('Loading')
    }
  }, [data])

  return (
    <div className={styles.feed_list_component}>
      <div>
        {posts?.map((val) => {
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

export default PostList
