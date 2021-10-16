import React, { useState, useEffect } from 'react'
import styles from '../../../css/homepage.module.css'
import { Chart } from 'react-google-charts'
import jwt_decode from 'jwt-decode'
import { FetchMySentimentActivity } from './api'
import { useQuery } from '@apollo/client'
import Skeleton from '@material-ui/lab/Skeleton'

function RightComponent() {
  let decodedToken = jwt_decode(localStorage.getItem('token'))
  let myId = decodedToken.userId

  const [myPost, setMyPost] = useState([])

  let chartData = [['x', 'Positive', 'Negative', 'Neutral']]

  const { data } = useQuery(FetchMySentimentActivity, {
    variables: {
      userId: myId,
    },
  })

  useEffect(() => {
    if (data) {
      setMyPost(data.User[0].posts)

      for (var i = 0; i < myPost.length; i++) {
        if (myPost[i].sentiment == null) {
          continue
        } else {
          chartData.push([
            myPost[i].postId,
            JSON.parse(myPost[i].sentiment.sentiment[0])[0].confidenceScores
              .positive * 100,
            JSON.parse(myPost[i].sentiment.sentiment[0])[0].confidenceScores
              .negative * 100,
            JSON.parse(myPost[i].sentiment.sentiment[0])[0].confidenceScores
              .neutral * 100,
          ])
        }
      }
    }
  })

  //haSH TAGS TRENDING
  return (
    <div className={styles.right_component}>
      <div className={styles.right_component_header}>
        <h4>Your Activity</h4>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Chart
          width={'270px'}
          height={'275px'}
          chartType="LineChart"
          loader={
            <div>
              <Skeleton
                variant="rect"
                width={210}
                height={118}
                animation="wave"
              />
            </div>
          }
          data={chartData}
          options={{
            hAxis: {
              title: 'Post',
            },
            vAxis: {
              title: 'Score',
            },
            series: {
              0: { curveType: 'function', color: 'green' },
              1: { curveType: 'function', color: 'red' },
              2: { curveType: 'function', color: 'gray' },
            },
          }}
          rootProps={{ 'data-testid': '2' }}
        />
      </div>
      <div></div>
    </div>
  )
}

export default RightComponent
