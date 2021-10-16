import React from 'react'
import styles from '../../../../css/homepage.module.css'
import LeftComponent from '../LeftComponent'
import RightComponent from '../RightComponent'
import HeaderComponent from '../HeaderComponent'
import HashtagFeedList from './HashtagFeedList'
import { useParams } from 'react-router'

function Hashtag() {
  let { hashtag } = useParams()

  return (
    <div className={styles.container}>
      <div className="row">
        <div className="col-lg-2"></div>
        <div className="col-lg-8">
          <div className={styles.sub_container}>
            <HeaderComponent />
            <div className={styles.body}>
              <div className="row">
                <div className="col-lg-3">
                  <LeftComponent />
                </div>
                <div className="col-lg-6">
                  <HashtagFeedList hashtag={hashtag} />
                </div>
                <div className="col-lg-3">
                  <RightComponent />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-2"></div>
      </div>
    </div>
  )
}

export default Hashtag
