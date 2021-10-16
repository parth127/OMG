import React, { useState } from 'react'
import '../../../css/uploadProfilePicture.css'
import CloseIcon from '@material-ui/icons/Close'
import { IconButton } from '@material-ui/core'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import { storage } from '../../../Firebase'
import { UpdateCoverPicture } from './api'
import { useMutation } from '@apollo/client'

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

function CoverPicture({ trigger, setTrigger, myId }) {
  const [image, setImage] = useState()
  const [updateCoverPicture] = useMutation(UpdateCoverPicture, {
    onCompleted: () => {
      window.location.reload(false)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const handleUploadbtn = (e) => {
    e.preventDefault()

    var name = image.name
    var fileName = makeid(20) + name
    const uploadTask = storage.ref(`CoverPicture/${fileName}`).put(image)
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
          .ref('CoverPicture')
          .child(fileName)
          .getDownloadURL()
          .then((url) => {
            updateCoverPicture({
              variables: {
                userId: myId,
                coverPicture: url,
              },
            })
          })
      }
    )
  }

  return trigger ? (
    <div className="profile_Picture">
      <div className="card">
        <div className="head">
          <h4>Upload Cover Picture</h4>
          <IconButton
            className="closeButton"
            onClick={() => {
              setTrigger(false)
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className="bottom">
          <div className="selectImage">
            <div className="createPost_imgupload">
              <label htmlFor="fileInput">
                <AddAPhotoIcon
                  style={{ cursor: 'pointer', fontSize: '25px' }}
                />
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
          </div>
          <div className="previewAndButton">
            <div className="createpost_imgpreview">
              <img id="img-preview" alt="" />
            </div>
            <button className="createPost_uploadbtn" onClick={handleUploadbtn}>
              Upload Picture
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ''
  )
}

export default CoverPicture
