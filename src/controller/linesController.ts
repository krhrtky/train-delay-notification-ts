import { APIGatewayProxyHandler } from 'aws-lambda'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { getKantoLineNames } from '../api/train'

import 'source-map-support/register'

const dynamoOption = process.env.IS_OFFLINE
  ? {
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    }
  : null
const doc = new DocumentClient(dynamoOption)

const getInitialDate = async () => {
  console.log('初期データ登録')
  const lines = (await getKantoLineNames()).map(name => ({
    name,
    notice: true
  }))

  console.log(doc.put)
  for (const line of lines) {
    await doc
      .put({
        TableName: process.env.DYNAMODB_TABLE,
        Item: line
      })
      .promise()
  }

  return lines
}

export const findAll: APIGatewayProxyHandler = async () => {
  try {
    const { Items } = await doc
      .scan({
        TableName: process.env.DYNAMODB_TABLE
      })
      .promise()

    const lines = Items.length === 0 ? await getInitialDate() : Items

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify(
        {
          lines
        },
        null,
        2
      )
    }
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify({
        message: e.message
      })
    }
  }
}

export const findByLineName: APIGatewayProxyHandler = async event => {
  const lineName = decodeURI(event.pathParameters.lineName)
  console.log(`param: ${lineName}`)

  const { Item } = await doc
    .get({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        name: lineName
      }
    })
    .promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    },
    body: JSON.stringify({ line: Item }, null, 2)
  }
}

export const update: APIGatewayProxyHandler = async event => {
  const item = JSON.parse(event.body)
  console.log(item)

  await doc
    .put({
      TableName: process.env.DYNAMODB_TABLE,
      Item: item
    })
    .promise()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    },
    body: JSON.stringify({}, null, 2)
  }
}
