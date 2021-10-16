import React, { useState } from 'react'
import styles from '../../../../css/feedpost.module.css'
import moment from 'moment'
import { IconButton } from '@material-ui/core'
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined'
import SendIcon from '@material-ui/icons/Send'
import { IsLikedByME, AddLike, UnLike, UpdateLike } from './api'
import { useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { CommentComponent } from './CommentComponent'
import DeleteIcon from '@material-ui/icons/Delete'
import { DeleteFeed } from './DeleteFeed'
import MoodIcon from '@material-ui/icons/Mood'
import { Tooltip } from '@material-ui/core'
import SharePost from './SharePost'

function Post({ post_data, myId }) {
  const [isLiked, setIsLiked] = useState()
  const [noOfLikes, setNoOfLikes] = useState(post_data.likes)
  const { data } = useQuery(IsLikedByME, {
    variables: { postId: post_data.postId, userId: myId },
  })
  const [triggerComment, setTriggerComment] = useState(false)
  const [popUpTrigger, setPopUpTrigger] = useState(false)
  const [sharePopUp, setSharePopUp] = useState(false)

  useEffect(() => {
    if (data) {
      if (!data.Post[0].likedBy[0]) {
        setIsLiked(false)
      } else {
        if (data.Post[0].likedBy[0].userId == myId) {
          setIsLiked(true)
        }
      }
    }
  }, [data])

  const [addLike] = useMutation(AddLike)
  const [unLike] = useMutation(UnLike)
  const [updateLike] = useMutation(UpdateLike)

  const handleLike = () => {
    var newLike
    if (isLiked) {
      newLike = noOfLikes - 1
      setNoOfLikes(newLike)

      updateLike({
        variables: {
          postId: post_data.postId,
          likes: newLike,
        },
      })
      unLike({
        variables: {
          userId: myId,
          postId: post_data.postId,
        },
      })
    } else {
      newLike = noOfLikes + 1
      setNoOfLikes(newLike)

      updateLike({
        variables: {
          postId: post_data.postId,
          likes: newLike,
        },
      })
      addLike({
        variables: {
          userId: myId,
          postId: post_data.postId,
        },
      })
    }
    window.location.reload(false)
  }

  useEffect(() => {
    var element = document.getElementById(post_data.postId)

    element.innerHTML = element.innerHTML.replace(
      /#(\S+)/g,
      '<a href="/hashtag/$1" title="Find more posts tagged with $1" style="color: rgb(64, 80, 181)">#$1 </a>'
    )
  })

  return (
    <div className={styles.post_container_div}>
      <div className={styles.user_info}>
        <a
          href={
            post_data?.user?.userId == myId
              ? '/profile/'
              : '/profile/' + post_data?.user?.username
          }
        >
          <img
            src={
              post_data?.user?.profilePicture == null
                ? '/img/defaultProfilePicture.jpeg'
                : post_data?.user?.profilePicture
            }
            className={styles.user_profile_picture}
          />
        </a>
        <div className={styles.head}>
          <div className={styles.user_name}>
            <p className={styles.user}>
              {post_data?.user?.name == null
                ? post_data?.user?.username
                : post_data?.user?.name}
            </p>
            <p className={styles.post_time}>
              {moment(post_data.date).fromNow() + '.'}
            </p>
          </div>
          {post_data?.user?.userId == myId ? (
            <button
              className={styles.delete_button}
              onClick={() => {
                setPopUpTrigger(true)
              }}
            >
              <DeleteIcon className={styles.delete_icon} />
            </button>
          ) : (
            ''
          )}
          <DeleteFeed
            popUpTrigger={popUpTrigger}
            setPopUpTrigger={setPopUpTrigger}
            feedType={'Post'}
            feedId={post_data.postId}
          />
        </div>
      </div>
      <div className={styles.post_data}>
        <div className={styles.post_text}>
          <div className={styles.txt}>
            <p id={post_data.postId}>{post_data.text}</p>
          </div>
        </div>
        {post_data.img === null ? (
          ''
        ) : (
          <img src={post_data.img} className={styles.feedpost} />
        )}
      </div>
      <hr />
      <div className={styles.response_container_div}>
        <div className={styles.reaction_button}>
          <IconButton
            className={styles.reaction_button_icon}
            onClick={handleLike}
          >
            {isLiked === true ? (
              <FavoriteIcon style={{ color: 'red' }} />
            ) : (
              <FavoriteBorderOutlinedIcon className={styles.like_icon} />
            )}
          </IconButton>
          <p
            style={
              noOfLikes > 0
                ? { color: 'gray' }
                : { color: 'white', userSelect: 'none' }
            }
            className={styles.like_count}
          >
            {post_data?.likes}
          </p>
        </div>
        <div className={styles.reaction_button}>
          <IconButton
            className={styles.reaction_button_icon}
            onClick={() => {
              setTriggerComment(!triggerComment)
            }}
          >
            <ChatBubbleOutlineOutlinedIcon />
          </IconButton>
          <p
            style={
              post_data.numComments > 0
                ? { color: 'gray' }
                : { color: 'white', userSelect: 'none' }
            }
            className={styles.like_count}
          >
            {post_data.numComments}
          </p>
        </div>
        <div className={styles.reaction_button}>
          <IconButton
            className={styles.reaction_button_icon}
            onClick={() => {
              setSharePopUp(true)
            }}
          >
            <SendIcon />
          </IconButton>
          <SharePost
            postId={post_data.postId}
            sharePopUp={sharePopUp}
            setSharePopUp={setSharePopUp}
          />
        </div>
        <div className={styles.reaction_button}>
          <Tooltip title="Click here to view the sentiment report" arrow>
            <a
              href={'/sentiment/post/' + post_data.postId}
              style={{ color: 'gray' }}
            >
              <MoodIcon />
            </a>
          </Tooltip>
        </div>
        <div className={styles.text}>
          <p>{post_data?.feedback}</p>
        </div>
      </div>
      {triggerComment == true ? (
        post_data.commentIsDisabled ? (
          <div className={styles.disabledComment}>
            <p style={{ userSelect: 'none' }}>
              The owner of this post has disabled user comments.
            </p>
          </div>
        ) : (
          <div className={styles.comment}>
            <CommentComponent
              postId={post_data.postId}
              triggerComment={triggerComment}
            />
          </div>
        )
      ) : (
        ''
      )}
    </div>
  )
}

export default Post
