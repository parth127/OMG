import React from 'react'
import styles from '../../../../css/feedpost.module.css'
import moment from 'moment'
import { Chart } from 'react-google-charts'
import { Progress } from 'reactstrap'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { IconButton } from '@material-ui/core'

function SentimentReport({ postData, user, pos, neg, neu, sen, sentence }) {
  moment.locale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: 's',
      m: '1 min',
      mm: '%d min',
      h: '1 h',
      hh: '%d h',
      d: '1 d',
      dd: '%d d',
      M: '1 mth',
      MM: '%d mth',
      y: '1 y',
      yy: '%d y',
    },
  })

  var ptext = []
  var tBody = []
  for (var i = 0; i < sentence.length; i++) {
    tBody.push(
      <tr
        key={'tb' + i}
        style={{ textAlign: 'center', border: '1px solid lightgray' }}
      >
        <td style={{ textAlign: 'left', border: '1px solid lightgray' }}>
          {sentence[i].text}
        </td>
        <td style={{ textAlign: 'center', border: '1px solid lightgray' }}>
          <div>
            <Progress multi>
              <Progress
                bar
                color="success"
                value={sentence[i].confidenceScores.positive * 100}
              />
              <Progress
                bar
                color="danger"
                value={sentence[i].confidenceScores.negative * 100}
              />
              <Progress
                bar
                color="royalblue"
                value={sentence[i].confidenceScores.neutral * 100}
              />
            </Progress>
          </div>
        </td>
      </tr>
    )
    if (sentence[i].sentiment === 'positive') {
      ptext.push(
        <span key={i} style={{ color: 'green' }}>
          {sentence[i].text}
        </span>
      )
    } else if (sentence[i].sentiment === 'negative') {
      ptext.push(
        <span key={i} style={{ color: 'red' }}>
          {sentence[i].text}
        </span>
      )
    } else if (sentence[i].sentiment === 'neutral') {
      ptext.push(
        <span key={i} style={{ color: 'darkgray' }}>
          {sentence[i].text}
        </span>
      )
    }
  }

  return postData ? (
    <div className={styles.post_container_div} style={{ zIndex: 0 }}>
      <div className={styles.user_info}>
        <a
          href={'/post/' + postData.postId}
          className={styles.back_button_link}
        >
          <IconButton className={styles.back_button}>
            <ArrowBackIcon />
          </IconButton>
        </a>
        <a href={'/profile/' + ''}>
          <img
            src={
              user.profilePicture == null
                ? '/img/defaultProfilePicture.jpeg'
                : user.profilePicture
            }
            className={styles.user_profile_picture}
          />
        </a>
        <div className={styles.head}>
          <div className={styles.user_name}>
            <p className={styles.user}>
              {user.name == null ? user.username : user.name}
            </p>
            <p className={styles.post_time}>
              {moment(postData.date + '').fromNow() + '' + '.'}
            </p>
          </div>
        </div>
      </div>
      <div>
        <p style={{ marginLeft: '15px' }}>
          Sentiment:{' '}
          <span style={{ fontWeight: 'bold' }}>
            {(sen + '').charAt(0).toUpperCase() + (sen + '').slice(1)}
          </span>
        </p>
      </div>
      <div className={styles.sentiment_chart_div}>
        <Chart
          width={'450px'}
          height={'300px'}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={[
            ['Task', 'Hours per Day'],
            ['Positive', pos * 100],
            ['Negative', neg * 100],
            ['Neutral', neu * 100],
          ]}
          options={{
            title: 'Sentiment Report',
            // Just add this option
            pieHole: 0.3,
            slices: {
              0: { color: 'green' },
              1: { color: 'red' },
              2: { color: 'royalblue' },
            },
          }}
          rootProps={{ 'data-testid': '3' }}
        />
      </div>

      <div className={styles.post_data}>
        <div className={styles.post_text}>
          <div className={styles.txt}>
            <p id={postData.postId}>{ptext}</p>
          </div>
        </div>
        {postData.img === null ? (
          ''
        ) : (
          <img
            src={postData.img}
            className={styles.feedpost}
            style={{ marginBottom: '10px' }}
          />
        )}
      </div>
      <div className={styles.report_table_div}>
        <table className="table">
          <thead>
            <tr>
              <th
                scope="col"
                style={{ textAlign: 'left', border: '1px solid lightgray' }}
              >
                Sentence
              </th>
              <th
                scope="col"
                style={{ textAlign: 'center', border: '1px solid lightgray' }}
              >
                Sentiment
              </th>
            </tr>
          </thead>

          <tbody>{tBody}</tbody>
        </table>
      </div>
      <br></br>
    </div>
  ) : (
    ''
  )
}

export default SentimentReport
