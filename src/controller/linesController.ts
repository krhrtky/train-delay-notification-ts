import { APIGatewayProxyHandler } from 'aws-lambda'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import 'source-map-support/register'

const dynamoOption = process.env.IS_OFFLINE
  ? {
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    }
  : null
const doc = new DocumentClient(dynamoOption)

export const findAll: APIGatewayProxyHandler = async () => {
  try {
    const { Items } = await doc
      .scan({
        TableName: process.env.DYNAMODB_TABLE
      })
      .promise()

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          lines: Items
        },
        null,
        2
      )
    }
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: e.message
      })
    }
  }
}

export const findByLineName: APIGatewayProxyHandler = async event => {
  const lineName = event.pathParameters.lineName

  const { Item } = await doc
    .get({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        line: lineName
      }
    })
    .promise()

  return {
    statusCode: 200,
    body: JSON.stringify({ line: Item }, null, 2)
  }
}

export const update: APIGatewayProxyHandler = async event => {
  const item = JSON.parse(event.body)

  await doc
    .put({
      TableName: process.env.DYNAMODB_TABLE,
      Item: item
    })
    .promise()
  return {
    statusCode: 200,
    body: JSON.stringify({}, null, 2)
  }
}
