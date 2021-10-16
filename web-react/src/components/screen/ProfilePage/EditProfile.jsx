import React from 'react'
import styles from '../../../css/editProfile.module.css'
import CloseIcon from '@material-ui/icons/Close'
import { IconButton } from '@material-ui/core'
import { useState } from 'react'
import { UpdateProfile } from './api'
import { useMutation } from '@apollo/client'
import moment from 'moment'

function EditProfile({ trigger, setTrigger, myId, myData }) {
  const [firstName, setFirstName] = useState(
    myData?.name?.split(' ').slice(0, -1).join(' ')
  )
  const [lastName, setLastName] = useState(
    myData?.name?.split(' ').slice(-1).join(' ')
  )
  const [dateOfBirth, setDateOfBirth] = useState(myData?.dateOfBirth)
  const [gender, setGender] = useState(myData?.gender)
  const [city, setCity] = useState(myData?.city)
  const [province, setProvince] = useState(myData?.province)
  const [bio, setBio] = useState(myData?.bio)

  const [updateProfile] = useMutation(UpdateProfile, {
    onCompleted: () => {
      window.location.reload(false)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    var name = firstName + ' ' + lastName
    var dob = moment(dateOfBirth).format('MM/DD/YYYY')

    updateProfile({
      variables: {
        userId: myId,
        firstName: firstName,
        lastName: lastName,
        name: name,
        dateOfBirth: dob,
        gender: gender,
        city: city,
        province: province,
        bio: bio,
      },
    })
  }

  const handleClose = () => {
    setFirstName('')
    setLastName('')
    setCity('')
    setProvince('')
    setBio('')
    setTrigger(false)
    window.location.reload(false)
  }

  return trigger ? (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.head}>
          <h4>Edit Profile</h4>
          <IconButton className="closeButton" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className={styles.form}>
          <form onSubmit={handleSubmit}>
            <div className="row" style={{ marginTop: '10px' }}>
              <div className="col-6">
                <input
                  className={styles.input}
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  defaultValue={firstName}
                />
              </div>
              <div className="col-6">
                <input
                  className={styles.input}
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  defaultValue={lastName}
                />
              </div>
            </div>
            <div className="row" style={{ marginTop: '10px' }}>
              <div className="col-6">
                <input
                  type="date"
                  className={styles.input}
                  min="1990-01-0"
                  placeholder="Date of Birth"
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              <div
                className="col-6"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  fontSize: '18px',
                }}
              >
                Gender:{' '}
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <input type="radio" value="Male" name="gender" /> Male
                  <input type="radio" value="Female" name="gender" /> Female
                  <input type="radio" value="Other" name="gender" /> Other
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: '10px' }}>
              <div className="col-6">
                <input
                  className={styles.input}
                  placeholder="City"
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  defaultValue={myData.city}
                />
              </div>
              <div className="col-6">
                <input
                  className={styles.input}
                  placeholder="Province"
                  onChange={(e) => setProvince(e.target.value)}
                  value={province}
                  defaultValue={myData.province}
                />
              </div>
            </div>
            <div className="row" style={{ marginTop: '10px' }}>
              <div className="col-12">
                <textarea
                  className={styles.inputTextArea}
                  placeholder="Write something about yourself."
                  rows="4"
                  onChange={(e) => setBio(e.target.value)}
                  value={bio}
                  defaultValue={myData.bio}
                ></textarea>
              </div>
            </div>
            <div
              className="row"
              style={{ marginTop: '10px', marginBottom: '20px' }}
            >
              <div className="col-3"></div>
              <div className="col-6">
                <button className={styles.updateButton}>Update Profile</button>
              </div>
              <div className="col-3"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : (
    ''
  )
}

export default EditProfile
