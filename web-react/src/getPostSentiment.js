'use strict'
import { sentimentAnalysis, textAnalyticsClient } from './Sentiment'

export async function getPostSentiment(postInput) {
  return await sentimentAnalysis(textAnalyticsClient, postInput)
}
