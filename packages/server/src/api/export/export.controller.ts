import moment from 'moment-timezone';
import { Response } from 'express';
import { json2csvAsync } from 'json-2-csv';
import {
  ExportOrgQuery,
  ExportMusterIndividualsQuery, FilterConfig,
} from '@covid19-reports/shared';
import {
  ApiRequest,
  OrgParam,
} from '../api.router';
import { Observation } from '../observation/observation.model';
import { Roster } from '../roster/roster.model';
import { BadRequestError } from '../../util/error-types';
import { individualMusterComplianceByDateRange } from '../../util/muster-utils';
import { EntityService } from '../../util/entity-utils';

class ExportController {

  async exportOrgToCsv(req: ApiRequest<OrgParam, null, ExportOrgQuery>, res: Response) {
    const startDate = moment(req.query.startDate ?? 0);
    const endDate = moment(req.query.endDate);
    const filterConfig: FilterConfig = {
      timestamp: {
        op: 'between',
        expression: '',
        expressionEnabled: false,
        value: [
          startDate.toISOString(),
          endDate.toISOString(),
        ],
      },
    };

    const service = new EntityService(Observation);
    const rosterObservations = await service.getEntities({ limit: '0', page: '0', filterConfig }, req.appOrg!, req.appUserRole!);
    const csvChunk = await json2csvAsync(rosterObservations.rows, {
      emptyFieldValue: '',
    });

    res.write(Buffer.from(csvChunk));
    res.end();
  }

  async exportRosterToCsv(req: ApiRequest<OrgParam, null, null>, res: Response) {
    const service = new EntityService(Roster);
    const roster = await service.getEntities({ limit: '0', page: '0' }, req.appOrg!, req.appUserRole!);

    const csvChunk = await json2csvAsync(roster.rows, {
      emptyFieldValue: '',
    });

    res.write(Buffer.from(csvChunk));
    res.end();
  }

  async exportRosterMusterComplianceToCsv(req: ApiRequest<OrgParam, null, ExportMusterIndividualsQuery>, res: Response) {
    const fromDate = moment(req.query.fromDate, 'YYYY-MM-DD').startOf('day');
    const toDate = moment(req.query.toDate, 'YYYY-MM-DD').endOf('day');

    if (!fromDate.isValid() || !toDate.isValid() || fromDate > toDate) {
      throw new BadRequestError('Invalid ISO date range.');
    }

    // When filter id is missing, then data for the full roster is requested in getRosterMusterComplianceCalcByDateRange()
    const filterId = (req.query.filterId != null) ? parseInt(req.query.filterId) : undefined;
    const reportId = req.query.reportId;

    const complianceRecords = await individualMusterComplianceByDateRange(req.appOrg!, req.appUserRole!, filterId, reportId, fromDate.valueOf(), toDate.valueOf());
    const csvChunk = await json2csvAsync(complianceRecords.rows, {
      emptyFieldValue: '',
    });

    res.write(Buffer.from(csvChunk));
    res.end();
  }

}
export default new ExportController();
