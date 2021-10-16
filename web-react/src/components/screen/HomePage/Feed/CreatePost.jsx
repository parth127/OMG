import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { v4 as uuidv4 } from 'uuid'
import '../../../../css/createPost.css'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import CloseIcon from '@material-ui/icons/Close'
import { IconButton } from '@material-ui/core'
import { storage } from '../../../../Firebase'
import moment from 'moment'
import {
  createPost,
  CreateUserPostRelation,
  createSentiment,
  createPostSentimentRelation,
} from './api'
//import { performOpinionMining } from '../../../../performOpinionMining'
import { getPostSentiment } from '../../../../getPostSentiment'
import Switch from '@material-ui/core/Switch'

function makeid(length) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function findHashTags(searchText) {
  var result = searchText.match(/#\w+/g)

  if (result === null) {
    return false
  } else {
    return result
  }
}

function CreatePost({ trigger, setTrigger, username, userId, myData }) {
  const [postData, setPostData] = useState('')
  const [image, setImage] = useState()
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const [rId] = useState(uuidv4())

  const [CreatePostSentimentRelation] = useMutation(
    createPostSentimentRelation,
    {
      onCompleted: () => {
        window.location.reload(false)
      },
    }
  )

  const [CreateSentiment] = useMutation(createSentiment, {
    onCompleted: (data) => {
      CreatePostSentimentRelation({
        variables: {
          from: {
            postId: rId,
          },
          to: {
            sentimentId: data.CreateSentiment.sentimentId,
          },
        },
      })
    },
  })

  const [UserPostRelation] = useMutation(CreateUserPostRelation, {
    onCompleted: async () => {
      if (postData) {
        let sId = uuidv4()
        let sentimentResult = await getPostSentiment(postData)
        CreateSentiment({
          variables: {
            sentimentId: sId,
            sentiment: JSON.stringify(sentimentResult),
          },
        })
      } else {
        window.location.reload(false)
      }
    },
  })

  const [Post] = useMutation(createPost, {
    onCompleted: (data) => {
      UserPostRelation({
        variables: {
          from: {
            userId: userId,
          },
          to: {
            postId: data.CreatePost.postId,
          },
        },
      })
    },
  })

  if (isSuccess) {
    setIsSuccess(true)
  }

  const handleUploadbtn = async (e) => {
    e.preventDefault()
    var curDate = moment().format('MM-DD-YYYY HH:mm:ss')

    let hashResult = findHashTags(postData)

    if (!postData && !image) {
      ;('')
    } else {
      if (!image) {
        Post({
          variables: {
            postId: rId,
            text: postData,
            date: curDate,
            img: null,
            likes: 0,
            hashtag: hashResult === false ? null : JSON.stringify(hashResult),
            commentIsDisabled: isDisabled,
          },
        })
      } else {
        var name = image.name
        var fileName = makeid(20) + name
        const uploadTask = storage.ref(`images/${fileName}`).put(image)
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            console.log(snapshot)
          },
          (error) => {
            console.log(error)
          },
          () => {
            storage
              .ref('images')
              .child(fileName)
              .getDownloadURL()
              .then((url) => {
                Post({
                  variables: {
                    postId: rId,
                    text: postData,
                    date: curDate,
                    img: url,
                    likes: 0,
                    hashtag:
                      hashResult === false ? null : JSON.stringify(hashResult),
                    commentIsDisabled: isDisabled,
                  },
                })
              })
          }
        )
      }
    }
  }

  return trigger ? (
    <div className="post">
      <div className="createPost">
        <div>
          <div className="displayUser">
            <div className="displayUser_left">
              <div>
                <img
                  style={{ borderRadius: '50%' }}
                  src={
                    myData.profilePicture == null
                      ? 'img/defaultProfilePicture.jpeg'
                      : myData.profilePicture
                  }
                  id="userDisplayPic"
                />
              </div>
              <div className="displayUser_p">
                <p>{myData.name === null ? username : myData.name}</p>
              </div>
            </div>
            <div>
              <IconButton
                className="closeButton"
                onClick={() => {
                  setTrigger(false)
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <h4 className="createPost_h4">{`What's on your mind?`}</h4>
          <textarea
            className="createPost_textarea"
            rows="5"
            maxLength="400"
            value={postData}
            onChange={(e) => {
              setPostData(e.target.value)
            }}
            placeholder="Start typing to share your thoughts..."
          ></textarea>
          <div className="disableComment">
            <p>Disable Comments:</p>
            <div className="switch_div">
              <Switch
                checked={isDisabled}
                onChange={() => {
                  setIsDisabled(!isDisabled)
                }}
                color="primary"
                name="checkedB"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
          </div>

          <div className="createpost_imgpreview">
            <img id="img-preview" alt="" />
          </div>
        </div>

        <div className="createPost_bottom">
          <div className="createPost_imgupload">
            <label htmlFor="fileInput">
              <AddAPhotoIcon style={{ cursor: 'pointer', fontSize: '25px' }} />
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setImage(e.target.files[0])
                  var selectedImgsrc = URL.createObjectURL(e.target.files[0])
                  var imagePreview = document.getElementById('img-preview')
                  imagePreview.src = selectedImgsrc
                  imagePreview.style.display = 'block'
                }
              }}
            />
          </div>
          <button
            className="createPost_uploadbtn"
            onClick={handleUploadbtn}
            style={{ color: postData ? '#000' : '#999' }}
          >
            Upload Post
          </button>
        </div>
      </div>
    </div>
  ) : (
    ''
  )
}

export default CreatePost
