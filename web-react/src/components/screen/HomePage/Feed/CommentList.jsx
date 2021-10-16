import { useLazyQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { useState } from 'react'
import styles from '../../../../css/comment.module.css'
import { FetchAllComments } from './api'
import Comment from './Comment'

export function CommentList({ postId }) {
  /*const { data } = useQuery(FetchAllComments, {
    variables: {
      postId: postId,
    },
  })*/

  const [fetchAllComments, { data }] = useLazyQuery(FetchAllComments)
  const [postUserId, setPostUserId] = useState('')
  const [commentArray, setCommentArray] = useState([])

  useEffect(() => {
    fetchAllComments({
      variables: {
        postId: postId,
      },
    })
    if (data) {
      if (data.Post.length > 0) {
        setCommentArray(data.Post[0].comments)
        setPostUserId(data.Post[0].user.userId)
      }
    }
  }, [data])

  return (
    <div className={styles.comment_list_container}>
      {commentArray.map((val) => {
        return (
          <Comment comment={val} key={val.commentId} postUserId={postUserId} />
        )
      })}
    </div>
  )
}
