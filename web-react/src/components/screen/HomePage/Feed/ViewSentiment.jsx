import React from 'react'
import styles from '../../../../css/homepage.module.css'
import LeftComponent from '../LeftComponent'
import RightComponent from '../RightComponent'
import HeaderComponent from '../HeaderComponent'
import SentimentReport from './SentimentReport'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { GetPostSentiment } from './api'
import { getPostSentiment } from '../../../../getPostSentiment'

function ViewSentiment() {
  let { postId } = useParams()
  let postData = []
  let user = []
  let sentiment = []
  let pos = '',
    neg = '',
    neu = '',
    sen = ''
  let sentence = []

  const { error, loading, data } = useQuery(GetPostSentiment, {
    variables: {
      postId: postId,
    },
  })

  async function getSentiment() {
    if (data) {
      postData = data.Post[0]
      user = data.Post[0].user
      if (data.Post[0].sentiment === null) {
        sentiment = await getPostSentiment(data.Post[0].text)
        pos = sentiment[0].confidenceScores.positive
        neg = sentiment[0].confidenceScores.negative
        neu = sentiment[0].confidenceScores.neutral
        sen = sentiment[0].sentiment
        sentence = sentiment[0].sentences
      } else {
        sentiment = JSON.parse(data.Post[0].sentiment.sentiment[0])
        pos = sentiment[0].confidenceScores.positive
        neg = sentiment[0].confidenceScores.negative
        neu = sentiment[0].confidenceScores.neutral
        sen = sentiment[0].sentiment
        sentence = sentiment[0].sentences
      }
    } else if (loading) {
      console.log(loading)
    } else if (error) {
      console.log(error)
    }
  }

  getSentiment()

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
                  <SentimentReport
                    postData={postData}
                    user={user}
                    sentiment={sentiment}
                    pos={pos}
                    neg={neg}
                    neu={neu}
                    sen={sen}
                    sentence={sentence}
                  />
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

export default ViewSentiment
