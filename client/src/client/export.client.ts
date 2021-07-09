import { ExportMusterIndividualsQuery } from 'covid19-reports-server/src/api/export/export.controller';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('export');

export class ExportClient {

  static exportRosterToCsv(orgId: number): Promise<BlobPart> {
    return client.get(`${orgId}/roster`, {
      responseType: 'blob',
    });
  }

  static exportMusterRosterToCsv(orgId: number, query: ExportMusterIndividualsQuery): Promise<BlobPart> {
    return client.get(`${orgId}/muster/roster`, {
      params: query,
      responseType: 'blob',
    });
  }

}
