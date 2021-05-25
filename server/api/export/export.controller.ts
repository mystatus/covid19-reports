import { SearchResponse } from 'elasticsearch';
import { Response } from 'express';
import { json2csvAsync } from 'json-2-csv';
import moment from 'moment';
import { UserSelector } from '../../../src/selectors/user.selector';
import { elasticsearch } from '../../elasticsearch/elasticsearch';
import { assertRequestQuery } from '../../util/api-utils';
import { buildEsIndexPatternsForDataExport } from '../../util/elasticsearch-utils';
import { InternalServerError } from '../../util/error-types';
import { getRosterMusterStats } from '../../util/muster-utils';
import {
  TimeInterval,
} from '../../util/util';
import {
  ApiRequest,
  OrgParam,
  PaginatedQuery,
} from '../index';
import { RosterHistory } from '../roster-history/roster-history.model';
import {
  RosterColumnInfo,
  RosterColumnValue,
  RosterEntrySerialized,
  RosterFileRow,
  RosterHistoryEntrySerialized,
} from '../roster/roster.types';
import { Roster } from '../roster/roster.model';
import { Unit } from '../unit/unit.model';
import orgId = UserSelector.orgId;

class ExportController {

  async exportOrgToCsv(req: ApiRequest<null, null, ExportOrgQuery>, res: Response) {
    const startDate = moment(req.query.startDate ?? 0);
    const endDate = moment(req.query.endDate);

    //
    // Get ES data and stream to client.
    //
    const scrollQueue = [] as SearchResponse<any>[];
    try {
      scrollQueue.push(await elasticsearch.search({
        index: buildEsIndexPatternsForDataExport(req.appUser, req.appUserRole!),
        size: 10000,
        body: {
          query: {
            bool: {
              must: [{
                range: {
                  Timestamp: {
                    gte: startDate.toISOString(),
                    lt: endDate.toISOString(),
                  },
                },
              }],
            },
          },
        },
        scroll: '30s', // Keep the results "scrollable" for 30 seconds (this will be reset on every scroll).
      }));
    } catch (err) {
      throw new InternalServerError(`Elasticsearch: ${err.message}`);
    }

    // Keep scrolling until we've sent all of the hits.
    let hitsSent = 0;
    while (scrollQueue.length) {
      const chunk = scrollQueue.shift()!;

      // Send the total hits before the first chunk so the client can calculate progress.
      const isFirstChunk = (hitsSent === 0);
      if (isFirstChunk) {
        res.header('total-hits', `${chunk.hits.total}`);
      }

      const sourceArray = chunk.hits.hits.map(hit => hit._source);

      const csvChunk = await json2csvAsync(sourceArray, {
        prependHeader: isFirstChunk,
        emptyFieldValue: '',
      });

      res.write(Buffer.from(csvChunk));

      hitsSent += chunk.hits.hits.length;
      if (hitsSent >= chunk.hits.total) {
        break;
      }

      // Get the next response.
      try {
        scrollQueue.push(await elasticsearch.scroll({
          scrollId: chunk._scroll_id!,
          scroll: '30s',
        }));
      } catch (err) {
        throw new Error(`Elasticsearch: ${err.message}`);
      }
    }

    res.end();
  }

  async exportRosterToCsv(req: ApiRequest, res: Response) {
    const csv = Roster.getCsv(req.appOrg!, req.appUserRole!);
    const date = new Date().toISOString();
    const filename = `org_${req.appOrg!.id}_roster_export_${date}.csv`;
    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    res.send(csv);
  }

  async exportRosterHistoryToCsv(req: ApiRequest, res: Response) {
    const csv = RosterHistory.getCsv(req.appOrg!);
    const date = new Date().toISOString();
    const filename = `org_${req.appOrg!.id}_roster_history_export_${date}.csv`;
    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    res.send(csv);
  }

  async exportMusterIndividualsToCsv(req: ApiRequest<OrgParam, null, ExportMusterIndividualsQuery>, res: Response) {
    assertRequestQuery(req, [
      'interval',
      'intervalCount',
    ]);

    const interval = req.query.interval;
    const intervalCount = parseInt(req.query.intervalCount);

    const individuals = await getRosterMusterStats({
      org: req.appOrg!,
      userRole: req.appUserRole!,
      interval,
      intervalCount,
      unitId: req.query.unitId,
    });

    // Delete roster ids since they're meaningless to the user.
    for (const individual of individuals) {
      delete (individual as any).id;
    }

    const csv = await json2csvAsync(individuals);

    res.header('Content-Type', 'text/csv');
    res.attachment('muster-noncompliance.csv');
    res.send(csv);
  }

}

type ExportOrgQuery = {
  startDate?: string
  endDate?: string
};

type ExportMusterIndividualsQuery = {
  interval: TimeInterval
  intervalCount: string
  unitId?: number
} & PaginatedQuery;

export default new ExportController();
