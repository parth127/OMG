import React, { useEffect, useState } from 'react'
import styles from '../../../../css/homepage.module.css'
import Post from './Post'
import { useQuery } from '@apollo/client'
import { GetHashtagFeed } from './api'
import jwt_decode from 'jwt-decode'

function HashtagFeedList({ hashtag }) {
  console.log(hashtag)

  const [myId, setMyId] = useState()
  const { error, loading, data } = useQuery(GetHashtagFeed, {
    variables: {
      hashtag: hashtag,
    },
  })
  const [posts, setPosts] = useState([])

  useEffect(() => {
    var decodedToken = jwt_decode(localStorage.getItem('token'))
    setMyId(decodedToken.userId)

    if (data) {
      setPosts(data.Post)
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

export default HashtagFeedList
