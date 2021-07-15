import {
  ApproveAccessRequestBody,
  DenyAccessRequestBody,
  IssueAccessRequestBody,
} from '@covid19-reports/shared';
import { ApiAccessRequest } from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('access-request');

export class AccessRequestClient {

  static getAccessRequests(orgId: number): Promise<ApiAccessRequest[]> {
    return client.get(`${orgId}`);
  }

  static issueAccessRequest(orgId: number, body: IssueAccessRequestBody): Promise<ApiAccessRequest> {
    return client.post(`${orgId}`, body);
  }

  static approveAccessRequest(orgId: number, body: ApproveAccessRequestBody): Promise<void> {
    return client.post(`${orgId}/approve`, body);
  }

  static denyAccessRequest(orgId: number, body: DenyAccessRequestBody): Promise<void> {
    return client.post(`${orgId}/deny`, body);
  }

  static cancelAccessRequest(orgId: number): Promise<void> {
    return client.post(`${orgId}/cancel`);
  }

}
