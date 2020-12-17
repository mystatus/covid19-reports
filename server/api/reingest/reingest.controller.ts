import { Response } from 'express';
import { ApiRequest, EdipiParam } from '../index';
import config from '../../config';
import { dateFromString } from '../../util/util';
import AWS from 'aws-sdk';
import { BadRequestError, InternalServerError } from '../../util/error-types';


const maxPayloadSize = 100;
class ReingestController {

  async reingestSymptomRecords(req: ApiRequest<EdipiParam, TimestampData>, res: Response) {

    let startDate = 0;
    let endDate = Date.now();
    if (req.body.startTime) {
      startDate = convertDateParam(req.body.startTime);
    }

    if (req.body.endTime) {
      endDate = convertDateParam(req.body.endTime);
    }

    const dynamoDB = new AWS.DynamoDB();
    const queryInput = {
      TableName: config.dynamo.symptomTable,
      IndexName: config.dynamo.symptomIndex,
      KeyConditions: {
        'EDIPI': {
          ComparisonOperator: 'EQ',
          AttributeValueList: [
            {
              S: req.params.edipi,
            },
          ],
        },
        'Timestamp': {
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

    try {
      const data = await dynamoDB.query(queryInput).promise();

      const {payloads, recordsIngested} = buildPayloadsFromData(data);

      const lambda = new AWS.Lambda();
      let lambdaInvocationCount = 0;
      for (const lambdaPayload in payloads) {
        const lambdaParams = {
          FunctionName: config.dynamo.symptomLambda,
          Payload: Buffer.from(JSON.stringify(lambdaPayload)),
          InvocationType: 'Event'
        }
        lambda.invoke(lambdaParams);
        lambdaInvocationCount++;
      }

      res.status(201).json({
        'reingest-count': recordsIngested,
        'lambda-invoke-count': lambdaInvocationCount
      });
    } catch(err) {
      console.log('Reingest Failed: ', err.message);
      throw new InternalServerError(`Error during reingest request: ${err.message}`);
    }
  }

}

function buildPayloadsFromData(data: AWS.DynamoDB.QueryOutput) {
  let payload = {
    Records: new Array<LambdaRecord>()
  }
  const payloads = [];
  let recordsIngested = 0;
  for (const dbItem in data.Items) {
    const record = {
      eventName: 'INSERT',
      dynamodb: {
        'NewImage': dbItem
      }
    }

    payload.Records.push(record);
    if (payload.Records.length >= maxPayloadSize) {
      payloads.push(payload);
      payload = {
        Records: new Array<LambdaRecord>()
      }
    }
    recordsIngested++;
  }

  if (payload.Records.length > 0) {
    payloads.push(payload);
  }
  return {
    payloads,
    recordsIngested
  };
}

function convertDateParam(date: string | number | Date): number {
  if (typeof date == "string") {
    const convertedDate = dateFromString(date);
    if (!convertedDate) {
      throw new BadRequestError(`Invalid date string provided for reingest: ${date}`);
    }
    return convertedDate.getTime();
  } else if (date instanceof Date) {
    return date.getTime();
  }
  return date
}

interface TimestampData {
  startTime?: string | number | Date,
  endTime?: string | number | Date,
}

interface LambdaRecord {
  eventName: string,
  dynamodb: object
}

export default new ReingestController();
