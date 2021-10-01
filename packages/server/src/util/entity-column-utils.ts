import {
  ColumnInfo,
  ColumnsConfig,
  EntityType,
  FilterConfig,
  getFullyQualifiedColumnName,
} from '@covid19-reports/shared';
import _ from 'lodash';
import { Org } from '../api/org/org.model';
import { Roster } from '../api/roster/roster.model';
import { Observation } from '../api/observation/observation.model';

export type EntityColumnLookup = {
  [K in EntityType]: {
    [columnName: string]: ColumnInfo;
  }
};

export async function buildEntityColumnLookup(org: Org): Promise<EntityColumnLookup> {
  return {
    roster: _.keyBy(await Roster.getColumns(org), x => x.name),
    observation: _.keyBy(await Observation.getColumns(org), x => x.name),
  };
}

export function getRequiredPermissionsForColumns(
  columnsConfig: ColumnsConfig | FilterConfig,
  entityColumnLookup: EntityColumnLookup,
) {
  const columns: ColumnInfo[] = [];
  for (const columnLookup of _.values(entityColumnLookup)) {
    for (const column of _.values(columnLookup)) {
      const fullyQualifiedColumnName = getFullyQualifiedColumnName(column);
      if (columnsConfig[fullyQualifiedColumnName]) {
        columns.push(column);
      }
    }
  }

  return {
    pii: _.some(columns, column => column.pii),
    phi: _.some(columns, column => column.phi),
  };
}
