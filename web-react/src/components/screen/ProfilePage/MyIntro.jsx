import React, { useState } from 'react'
import styles from '../../../css/userprofile.module.css'
import PersonIcon from '@material-ui/icons/Person'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import EmailIcon from '@material-ui/icons/Email'
import PeopleIcon from '@material-ui/icons/People'
import EditProfile from './EditProfile'

function MyIntro({ myData, myId }) {
  const [editProfileTrigger, setEditProfileTrigger] = useState(false)

  return (
    <div className={styles.info_div}>
      <h4 style={{ fontWeight: 'bold' }}>Intro</h4>
      <div className={styles.info_detail_div}>
        <PersonIcon />
        <p>
          <span>{myData.name}</span>
        </p>
      </div>
      <div className={styles.info_detail_div}>
        <LocationOnIcon />
        <p>
          From{` `}
          <span>{myData.city + ',' + myData.province}</span>
        </p>
      </div>
      <div className={styles.info_detail_div}>
        <EmailIcon />
        <p>{myData.emailId}</p>
      </div>
      <div className={styles.info_detail_div}>
        <PeopleIcon />
        <p>
          <span>{myData.noOfFriends}</span>{' '}
          {myData.noOfFriends === 1 ? 'Friend' : 'Friends'}
        </p>
      </div>
      <div className={styles.info_detail_div}>
        <button
          className={styles.editDetailsButton}
          onClick={() => {
            setEditProfileTrigger(true)
          }}
        >
          Edit Details
        </button>
      </div>
      <EditProfile
        trigger={editProfileTrigger}
        setTrigger={setEditProfileTrigger}
        myId={myId}
        myData={myData}
      />
    </div>
  )
}

export default MyIntro
