import { Avatar } from '@material-ui/core'
import React, { useState } from 'react'
import styles from '../../../../css/comment.module.css'
import moment from 'moment'
import DeleteIcon from '@material-ui/icons/Delete'
import jwt_decode from 'jwt-decode'
import { DeleteFeed } from './DeleteFeed'

function Comment({ comment, postUserId }) {
  let decodedToken = jwt_decode(localStorage.getItem('token'))
  let myId = decodedToken.userId
  const [popUpTrigger, setPopUpTrigger] = useState(false)

  moment.locale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: 's',
      m: '1 min',
      mm: '%d min',
      h: '1 h',
      hh: '%d h',
      d: '1 d',
      dd: '%d d',
      M: '1 mth',
      MM: '%d mth',
      y: '1 y',
      yy: '%d y',
    },
  })
  return (
    <div className={styles.comment_container}>
      <a href={'/profile/' + comment.user.username}>
        <Avatar
          src={
            comment.user.profilePicture == null
              ? 'img/defaultProfilePicture.jpeg'
              : comment.user.profilePicture
          }
        />
      </a>

      <div className={styles.comment_text_area}>
        <div className={styles.comment_text_area_head}>
          <a
            href={'/profile/' + comment.user.username}
            style={{ color: '#4050b5' }}
          >
            <p className={styles.user_name}>
              {comment.user.name === null
                ? comment.user.username
                : comment.user.name}
              {postUserId === comment.user.userId ? (
                <span style={{ fontWeight: 'lighter', fontSize: '13px' }}>
                  {` `}Author
                </span>
              ) : (
                ''
              )}
            </p>
          </a>

          <p className={styles.date}>{moment(comment.date).fromNow() + '.'}</p>
        </div>
        <div className={styles.comment_text_area_bottom}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{comment.text}</p>
          {myId === comment.user.userId ? (
            <button
              className={styles.deleteCommentButton}
              onClick={() => {
                setPopUpTrigger(true)
              }}
            >
              <DeleteIcon className={styles.delete_icon} />
            </button>
          ) : myId === postUserId ? (
            <button
              className={styles.deleteCommentButton}
              onClick={() => {
                setPopUpTrigger(true)
              }}
            >
              <DeleteIcon className={styles.delete_icon} />
            </button>
          ) : (
            ''
          )}
        </div>
        <DeleteFeed
          popUpTrigger={popUpTrigger}
          setPopUpTrigger={setPopUpTrigger}
          feedType={'Comment'}
          feedId={comment.commentId}
        />
      </div>
    </div>
  )
}

export default Comment
