import React, { Component } from 'react'
import HeaderComponent from './HeaderComponent'

import styles from '../../../css/homepage.module.css'
import LeftComponent from './LeftComponent'
import FeedList from './Feed/FeedList'
import RightComponent from './RightComponent'

class HomePage extends Component {
  render() {
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
                    <FeedList />
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
}

export default HomePage
