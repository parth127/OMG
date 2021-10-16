import React from 'react'
import styles from '../../../../css/newComment.module.css'
import { Avatar } from '@material-ui/core'
import { useState } from 'react'
import {
  FetchMyDetails,
  AddNewComment,
  AddPostComment,
  AddUserComment,
} from './api'
import jwt_decode from 'jwt-decode'
import { useMutation, useQuery } from '@apollo/client'
import { useEffect } from 'react'

import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

function calcHeight(value) {
  let numberOfLineBreaks = (value.match(/\n/g) || []).length
  let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2
  return newHeight
}

export function NewComment({ postId, isCommented, setIsCommented }) {
  let decodedToken = jwt_decode(localStorage.getItem('token'))
  let myId = decodedToken.userId

  const [myData, setMyData] = useState([])

  const { data } = useQuery(FetchMyDetails, {
    variables: { userId: myId },
  })

  useEffect(() => {
    if (data) {
      setMyData(data.User[0])
    }
  }, [data])

  const [inputHeight, setInputHeight] = useState()
  const [inputComment, setInputComment] = useState('')

  const [addUserComment] = useMutation(AddUserComment, {
    onCompleted: () => {
      setInputComment('')
      setIsCommented(!isCommented)
      window.location.reload(false)
    },
  })

  const [addPostComment] = useMutation(AddPostComment, {
    onCompleted: (data) => {
      addUserComment({
        variables: {
          userId: myId,
          commentId: data.AddPostComments.from.commentId,
        },
      })
    },
  })

  const [addNewComment] = useMutation(AddNewComment, {
    onCompleted: (data) => {
      addPostComment({
        variables: {
          commentId: data.CreateComment.commentId,
          postId: postId,
        },
      })
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    var rId = uuidv4()
    var curDate = moment().format('MM-DD-YYYY HH:mm:ss')

    addNewComment({
      variables: {
        commentId: rId,
        text: inputComment.trim(),
        date: curDate,
      },
    })
  }

  return (
    <div className={styles.body}>
      <Avatar
        src={
          myData.profilePicture == null
            ? 'img/defaultProfilePicture.jpeg'
            : myData.profilePicture
        }
      />
      <form className={styles.comment_form}>
        <textarea
          style={{ height: inputHeight, overflow: 'hidden', resize: 'none' }}
          className={styles.comment_input}
          onChange={(e) => {
            setInputHeight(calcHeight(e.target.value) + 'px')
            setInputComment(e.target.value)
          }}
          placeholder="Add a comment..."
          value={inputComment}
        ></textarea>
        {inputComment.trim().length > 0 ? (
          <button className={styles.comment_button} onClick={handleSubmit}>
            Post
          </button>
        ) : (
          ''
        )}
      </form>
    </div>
  )
}
