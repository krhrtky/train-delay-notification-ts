import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import axios from 'axios'

import 'source-map-support/register'
import { getDelays } from '../api/train'

const dynamoOption = process.env.IS_OFFLINE
  ? {
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    }
  : null
const doc = new DocumentClient(dynamoOption)

export const execute = async () => {
  const delays = await getDelays()

  const { Items } = await doc
    .scan({
      TableName: process.env.DYNAMODB_TABLE
    })
    .promise()

  const notificationTarget = Items.filter(item => item.notice)

  const result = delays.filter(delay =>
    notificationTarget.find(item => item.name === delay.name)
  )

  if (result.length === 0) {
    await axios.post(
      process.env.SLACK_API_END_POINT,
      {
        text: '現在、遅延はありません。'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } else {
    for (const delay of result) {
      await axios.post(
        process.env.SLACK_API_END_POINT,
        {
          text: `[${delay.name}] ${delay.description}`
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }
  }
}
