import { SearchResponse } from 'elasticsearch';
import { Response } from 'express';
import { json2csvAsync } from 'json-2-csv';
import moment from 'moment';
import { elasticsearch } from '../../elasticsearch/elasticsearch';
import { assertRequestQuery } from '../../util/api-utils';
import { buildEsIndexPatternsForDataExport } from '../../util/elasticsearch-utils';
import { InternalServerError } from '../../util/error-types';
import { getRosterMusterStats } from '../../util/muster-utils';
import {
  getCsvHeaderForRosterColumn,
  getCsvValueForRosterColumn,
} from '../../util/roster-utils';
import {
  ApiRequest,
  OrgParam,
  PaginatedQuery,
} from '../index';
import {
  RosterColumnInfo,
  RosterColumnValue,
  RosterEntryData,
  RosterFileRow,
} from '../roster/roster.types';
import { Roster } from '../roster/roster.model';
import { Unit } from '../unit/unit.model';

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
    const orgId = req.appOrg!.id;

    const queryBuilder = await Roster.queryAllowedRoster(req.appOrg!, req.appUserRole!);
    const rosterData = await queryBuilder
      .orderBy({
        edipi: 'ASC',
      })
      .getRawMany<RosterEntryData>();

    const unitIdNameMap: { [key: number]: string } = {};
    const units = await Unit.find({
      where: {
        org: orgId,
      },
    });

    units.forEach(unit => {
      unitIdNameMap[unit.id] = unit.name;
    });

    const columns = await Roster.getAllowedColumns(req.appOrg!, req.appUserRole!.role);
    const columnsLookup: { [columnName: string]: RosterColumnInfo } = {};
    for (const column of columns) {
      columnsLookup[column.name] = column;
    }

    // Convert data to csv format and download.
    const csv = await json2csvAsync(rosterData.map(entry => {
      // Convert column 'name' keys to column 'displayName' keys.
      const row: RosterFileRow<RosterColumnValue> = {
        Unit: unitIdNameMap[entry.unit],
      };

      for (const columnName of Object.keys(entry)) {
        const column = columnsLookup[columnName];
        if (column == null || column.name === 'unit') {
          continue;
        }

        const header = getCsvHeaderForRosterColumn(column);
        row[header] = getCsvValueForRosterColumn(entry, column);
      }

      return row;
    }));

    const date = new Date().toISOString();
    const filename = `org_${orgId}_roster_export_${date}.csv`;
    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    res.send(csv);
  }

  async exportMusterIndividualsToCsv(req: ApiRequest<OrgParam, null, ExportMusterIndividualsQuery>, res: Response) {
    assertRequestQuery(req, [
      'fromDate',
      'toDate',
    ]);

    const fromDate = moment(req.query.fromDate);
    const toDate = moment(req.query.toDate);

    const individuals = await getRosterMusterStats({
      org: req.appOrg!,
      userRole: req.appUserRole!,
      unitId: req.query.unitId,
      fromDate,
      toDate,
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
  fromDate: string
  toDate: string
  unitId?: number
} & PaginatedQuery;

export default new ExportController();
