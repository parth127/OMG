import React from 'react'
import { useParams } from 'react-router'
import styles from '../../../../css/homepage.module.css'
import LeftComponent from '../LeftComponent'
import RightComponent from '../RightComponent'
import HeaderComponent from '../HeaderComponent'
import Post from './Post'
import { GetPost } from './api'
import { useQuery } from '@apollo/client'
import jwt_decode from 'jwt-decode'
import { useEffect } from 'react'

function ViewSinglePost() {
  let decodedToken = jwt_decode(localStorage.getItem('token'))
  let myId = decodedToken.userId
  const { postId } = useParams()
  let postData = ['']

  const { data } = useQuery(GetPost, {
    variables: {
      postId: postId,
    },
  })
  if (data) {
    postData = data.Post[0]
  }
  useEffect(() => {
    if (data) {
      postData = data.Post[0]
    }
  }, [])

  return data ? (
    <div className={styles.container}>
      <div className="row">
        <div className="col-lg-2"></div>
        <div className="col-lg-8">
          <div className={styles.sub_container}>
            <HeaderComponent />
            <div className={styles.body}>
              <div className="row">
                <div className="col-lg-3">
                  <LeftComponent />
                </div>
                <div className="col-lg-6">
                  <Post post_data={postData} myId={myId} />
                </div>
                <div className="col-lg-3">
                  <RightComponent />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-2"></div>
      </div>
    </div>
  ) : (
    ''
  )
}

export default ViewSinglePost
