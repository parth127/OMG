'use strict'

const {
  TextAnalyticsClient,
  AzureKeyCredential,
} = require('@azure/ai-text-analytics')

const key =
  process.env.REACT_APP_Sentiment_Key || 'f1adac727d064082b628c25fcc90be84'
const endpoint =
  process.env.REACT_APP_Sentiment_Endpoint ||
  'https://sentimentomg.cognitiveservices.azure.com/'
export const textAnalyticsClient = new TextAnalyticsClient(
  endpoint,
  new AzureKeyCredential(key)
)
export async function sentimentAnalysis(client, input) {
  const sentimentInput = [input]
  const sentimentResult = await client.analyzeSentiment(sentimentInput)
  return sentimentResult
}
export async function sentimentAnalysisWithOpinionMining(client, input) {
  const sentimentInput = [
    {
      text: input,
      id: '0',
      language: 'en',
    },
  ]
  const results = await client.analyzeSentiment(sentimentInput, {
    includeOpinionMining: true,
  })

  return results

  /*
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    console.log(`- Document ${result.id}`)
    if (!result.error) {
      console.log(`\tDocument text: ${sentimentInput[i].text}`)
      console.log(`\tOverall Sentiment: ${result.sentiment}`)
      console.log('\tSentiment confidence scores:', result.confidenceScores)
      console.log('\tSentences')
      for (const {
        sentiment,
        confidenceScores,
        opinions,
      } of result.sentences) {
        console.log(`\t- Sentence sentiment: ${sentiment}`)
        console.log('\t  Confidence scores:', confidenceScores)
        console.log('\t  Mined opinions')
        for (const { target, assessments } of opinions) {
          console.log(`\t\t- Target text: ${target.text}`)
          console.log(`\t\t  Target sentiment: ${target.sentiment}`)
          console.log(
            '\t\t  Target confidence scores:',
            target.confidenceScores
          )
          console.log('\t\t  Target assessments')
          for (const { text, sentiment } of assessments) {
            console.log(`\t\t\t- Text: ${text}`)
            console.log(`\t\t\t  Sentiment: ${sentiment}`)
          }
        }
      }
    } else {
      console.error(`\tError: ${result.error}`)
    }
  }
  */
}
