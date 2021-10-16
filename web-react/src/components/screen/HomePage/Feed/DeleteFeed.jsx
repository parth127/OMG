import React from 'react'
import styles from '../../../../css/deleteFeed.module.css'
import CloseIcon from '@material-ui/icons/Close'
import { IconButton } from '@material-ui/core'
import { DeleteComment, DeletePost } from './api'
import { useMutation } from '@apollo/client'

function DeleteFeed({ popUpTrigger, feedType, setPopUpTrigger, feedId }) {
  const [deleteComment] = useMutation(DeleteComment, {
    onCompleted: () => {
      setPopUpTrigger(false)
    },
  })

  const [deletePost] = useMutation(DeletePost, {
    onCompleted: () => {
      window.location.reload(false)
    },
  })

  const handleDelete = (e) => {
    e.preventDefault()

    if (feedType === 'Comment') {
      deleteComment({
        variables: {
          commentId: feedId,
        },
      })
    } else if (feedType === 'Post') {
      deletePost({
        variables: {
          postId: feedId,
        },
      })
    }
  }

  return popUpTrigger ? (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.head}>
          <h4 style={{ fontWeight: 'bold' }}>{'Delete ' + feedType}</h4>
          <IconButton
            className={styles.close_button}
            onClick={() => {
              setPopUpTrigger(false)
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className={styles.middle_part}>
          <p className={styles.text}>
            Are you sure you want to permanently remove this{' '}
            {feedType.toLowerCase()}
            {'?'}
          </p>
        </div>
        <div className={styles.bottom}>
          <button className={styles.delete_button} onClick={handleDelete}>
            Delete
          </button>
          <button
            className={styles.cancel_button}
            onClick={() => {
              setPopUpTrigger(false)
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : (
    ''
  )
}

export { DeleteFeed }
