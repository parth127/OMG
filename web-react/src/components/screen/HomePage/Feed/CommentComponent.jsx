import React, { useState } from 'react'
import styles from '../../../../css/commentComponent.module.css'
import { CommentList } from './CommentList'
import { NewComment } from './NewComment'

export function CommentComponent({ postId, triggerComment }) {
  const [isCommented, setIsCommented] = useState(false)

  return triggerComment ? (
    <div className={styles.body}>
      <NewComment
        isCommented={isCommented}
        setIsCommented={setIsCommented}
        postId={postId}
      />
      <CommentList postId={postId} />
    </div>
  ) : (
    ''
  )
}
