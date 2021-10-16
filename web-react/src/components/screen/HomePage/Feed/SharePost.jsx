import React from 'react'
import styles from '../../../../css/deleteFeed.module.css'
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import Snackbar from '@material-ui/core/Snackbar'

function SharePost({ sharePopUp, setSharePopUp, postId }) {
  const [state, setState] = React.useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center',
  })
  const { vertical, horizontal, open } = state
  const handleClick = () => {
    setState({ ...state, open: true })
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }
  return sharePopUp ? (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.head}>
          <h4 style={{ fontWeight: 'bold' }}>Share Post</h4>
          <IconButton
            className={styles.close_button}
            onClick={() => {
              setSharePopUp(false)
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className={styles.middle_part}>
          <p className={styles.share_text}>Copy this link to share the post</p>
        </div>
        <div className={styles.share}>
          <p>{'http://localhost:3000/post/' + postId}</p>
          <IconButton
            className={styles.copy_button}
            onClick={() => {
              navigator.clipboard.writeText(
                'http://localhost:3000/post/' + postId
              )
              handleClick()
            }}
          >
            <FileCopyOutlinedIcon style={{ color: 'black' }} />
          </IconButton>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Link copied."
        key={vertical + horizontal}
      />
    </div>
  ) : (
    ''
  )
}

export default SharePost
