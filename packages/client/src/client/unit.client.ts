import {
  AddUnitBody,
  UpdateUnitBody,
} from '@covid19-reports/shared';
import { ApiUnit } from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('unit');

export class UnitClient {

  static getUnits(orgId: number): Promise<ApiUnit[]> {
    return client.get(`${orgId}`);
  }

  static addUnit(orgId: number, body: AddUnitBody): Promise<ApiUnit> {
    return client.post(`${orgId}`, body);
  }

  static updateUnit(orgId: number, unitId: number, body: UpdateUnitBody): Promise<ApiUnit> {
    return client.put(`${orgId}/${unitId}`, body);
  }

  static deleteUnit(orgId: number, unitId: number): Promise<ApiUnit> {
    return client.delete(`${orgId}/${unitId}`);
  }

}
