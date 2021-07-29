import AWS from 'aws-sdk';
import config from '../config';
import { dateFromString } from './util';
import { BadRequestError } from './error-types';

const maxPayloadSize = 100;

interface LambdaRecord {
  eventName: string;
  dynamodb: object;
}

function buildPayloadsFromData(data: AWS.DynamoDB.QueryOutput) {
  let payload = {
    Records: new Array<LambdaRecord>(),
  };
  const payloads: { Records: LambdaRecord[] }[] = [];
  let recordsIngested = 0;
  if (!data.Items) {
    return {
      payloads,
      recordsIngested,
    };
  }
  for (const dbItem of data.Items) {
    const record = {
      eventName: 'INSERT',
      dynamodb: {
        NewImage: dbItem,
      },
    };

    payload.Records.push(record);
    if (payload.Records.length >= maxPayloadSize) {
      payloads.push(payload);
      payload = {
        Records: new Array<LambdaRecord>(),
      };
    }
    recordsIngested += 1;
  }

  if (payload.Records.length > 0) {
    payloads.push(payload);
  }
  return {
    payloads,
    recordsIngested,
  };
}

export function convertDateParam(date: string | number | Date): number {
  if (typeof date === 'string') {
    const convertedDate = dateFromString(date);
    if (!convertedDate) {
      throw new BadRequestError(`Invalid date string provided for reingest: ${date}`);
    }
    return convertedDate.getTime();
  } if (date instanceof Date) {
    return date.getTime();
  }
  return date;
}

function makeDocumentIdQuery(documentId: string): AWS.DynamoDB.QueryInput {
  return {
    TableName: config.dynamo.symptomTable,
    KeyConditions: {
      ID: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [
          {
            S: documentId,
          },
        ],
      },
    },
  };
}

function makeEdipiAndRangeQuery(edipi: string, startTime?: string | number | Date, endTime?: string | number | Date): AWS.DynamoDB.QueryInput {
  let startDate = 0;
  let endDate = Date.now();
  if (startTime) {
    startDate = convertDateParam(startTime);
  }

  if (endTime) {
    endDate = convertDateParam(endTime);
  }

  return {
    TableName: config.dynamo.symptomTable,
    IndexName: config.dynamo.symptomIndex,
    KeyConditions: {
      EDIPI: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [
          {
            S: edipi,
          },
        ],
      },
      Timestamp: {
        ComparisonOperator: 'BETWEEN',
        AttributeValueList: [
          {
            N: startDate.toString(),
          },
          {
            N: endDate.toString(),
          },
        ],
      },
    },
  };
}

export async function reingest(queryInput: AWS.DynamoDB.QueryInput) {
  const dynamoDB = new AWS.DynamoDB();
  const data = await dynamoDB.query(queryInput).promise();
  const { payloads, recordsIngested } = buildPayloadsFromData(data);
  const lambda = new AWS.Lambda();
  let lambdaInvocationCount = 0;

  for (const lambdaPayload of payloads) {
    try {
      const lambdaParams = {
        FunctionName: config.dynamo.symptomLambda,
        Payload: Buffer.from(JSON.stringify(lambdaPayload)),
        InvocationType: 'Event',
      };
      const request = lambda.invoke(lambdaParams);
      await request.promise();
      lambdaInvocationCount += 1;
    } catch (err) {
      console.error(err);
    }
  }
  return {
    lambdaInvocationCount,
    recordsIngested,
  };
}

export async function reingestBroadcast(queryInput: AWS.DynamoDB.QueryInput) {
  const tables = config.dynamo.symptomTable.split(',');
  let lambdaInvocationCount = 0;
  let recordsIngested = 0;

  for (const table of tables) {
    const result = await reingest({
      ...queryInput,
      TableName: table,
    });
    lambdaInvocationCount += result.lambdaInvocationCount;
    recordsIngested += result.recordsIngested;

    // Avoid additional querying since we've already hit found/processed the record.
    if (lambdaInvocationCount || recordsIngested) {
      break;
    }
  }
  return {
    lambdaInvocationCount,
    recordsIngested,
  };
}

export function reingestByDocumentId(documentId: string) {
  return reingestBroadcast(makeDocumentIdQuery(documentId));
}

export function reingestByEdipi(edipi: string, startTime?: string | number | Date, endTime?: string | number | Date) {
  return reingestBroadcast(makeEdipiAndRangeQuery(edipi, startTime, endTime));
}
