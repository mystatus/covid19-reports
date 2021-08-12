import { ColumnType } from '@covid19-reports/shared';
import { Org } from '../../../api/org/org.model';
import { CustomRosterColumn } from '../../../api/roster/custom-roster-column.model';

export function customRosterColumnTestData(org: Org, customColumnOrgCount: number) {
  const customColumn = CustomRosterColumn.create({
    org,
    display: `My Custom Column ${customColumnOrgCount}`,
    type: ColumnType.String,
    phi: false,
    pii: false,
    required: false,
  });
  return customColumn;
}
