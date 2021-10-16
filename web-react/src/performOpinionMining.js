'use strict'
import {
  sentimentAnalysisWithOpinionMining,
  textAnalyticsClient,
} from './Sentiment'
export async function performOpinionMining(postInput) {
  return await sentimentAnalysisWithOpinionMining(
    textAnalyticsClient,
    postInput
  )
}
