import React, { useCallback, useState } from 'react';
import { ColumnInfo, ColumnType, ColumnValue } from '@covid19-reports/shared';

import { ButtonWithSpinner } from '../../components/buttons/button-with-spinner';
import { ColumnAction, getRegistry } from '../actions';
import { QueryBuilderValueEditor } from '../../components/query-builder/query-builder-value-editor';
import { QueryRow } from '../../utility/query-builder-utils';
import { downloadCSVTemplate } from './downloadCSVTemplate';
import { exportCSV } from './exportCSV';

const registry = getRegistry('roster');

const expressions: Record<string, () => ColumnValue> = {
  now: () => new Date().toISOString(),
};

registry.register(downloadCSVTemplate);
registry.register(exportCSV);

export type DataActionRenderType = 'button' | 'editor';

export type DataAction = {
  name: string;
  displayName: string;
  renderType: DataActionRenderType;
  operations: Array<{
    field: string;
    value?: ColumnValue;
  }>;
};

const dataActionsResponse: DataAction[] = [{
  name: 'roster-add-to-rom',
  displayName: 'Add to ROM',
  renderType: 'button',
  operations: [
    { field: 'myCustomColumn1', value: 'now' },
  ],
}, {
  name: 'roster-remove-to-rom',
  displayName: 'Remove from ROM',
  renderType: 'button',
  operations: [
    { field: 'myCustomColumn1', value: undefined },
  ],
}, {
  name: 'roster-set-myCustomColumn1',
  displayName: 'Edit My Custom Column 1',
  renderType: 'editor',
  operations: [
    { field: 'myCustomColumn1' },
  ],
}];

export function ButtonAsyncSpinner({ children, onClick }: { children: React.ReactNode; onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<any> }) {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsExecuting(true);
    try {
      await onClick(event);
    } finally {
      setIsExecuting(false);
    }
  }, [onClick]);

  return (
    <ButtonWithSpinner
      onClick={handleClick}
      loading={isExecuting}
    >
      {children}
    </ButtonWithSpinner>
  );
}

const DataActionComponent = ({ columns, dataAction, row, columnAction }: { columns: ColumnInfo[]; dataAction: DataAction; row: any; columnAction: ColumnAction }) => {
  const [queryRows, setQueryRows] = useState<QueryRow[]>(
    dataAction.operations.map(({ field, value }) => {
      const column = columns.find(c => c.name === field);
      const queryRow: QueryRow = {
        field: {
          name: field,
          displayName: column?.displayName ?? field,
          type: column?.type ?? ColumnType.String,
        },
        op: '=',
        value: row[field] ?? value ?? '',
        expression: '',
        expressionEnabled: false,
      };
      return queryRow;
    }),
  );

  if (dataAction.renderType === 'button') {
    return (
      <ButtonAsyncSpinner onClick={() => columnAction.execute(row)}>
        {dataAction.displayName ?? 'Execute'}
      </ButtonAsyncSpinner>
    );
  }

  const hasChanges = queryRows.some(queryRow => row[queryRow.field.name] !== queryRow.value);

  return (
    <div style={{ position: 'relative', display: 'flex' }}>
      {hasChanges && (
        <div style={{ position: 'absolute', left: '-70px', top: 1 }}>
          <ButtonAsyncSpinner onClick={() => {
            const data: Record<string, any> = {};
            queryRows.forEach(queryRow => {
              data[queryRow.field.name] = queryRow.value;
            });
            return columnAction.execute(row, data);
          }}
          >
            Save
          </ButtonAsyncSpinner>
        </div>
      )}

      {queryRows.map((r, index) => (
        <QueryBuilderValueEditor
          key={r.field.name}
          row={r}
          onChange={x => {
            const a = queryRows.slice(0);
            a.splice(index, 1, x);
            setQueryRows(a);
          }}
        />
      ))}
    </div>
  );
};


export function registerDataActions(columns: ColumnInfo[]) {
  dataActionsResponse.forEach(action => {
    // this is likely inadquate, needs fully qualified?
    const cols = columns.filter(c => action.operations.some(a => a.field === c.name));

    registry.register(new ColumnAction({
      name: action.name,
      displayName: action.displayName,
      pii: cols.some(c => c.pii),
      phi: cols.some(c => c.phi),
      canMenu: action.renderType !== 'editor',
    },
    (row: any, data?: any) => {
      const patchPayload: Record<string, ColumnValue> = {};

      action.operations.forEach(({ field, value }) => {
        const v = value ?? data?.[field];
        patchPayload[field] = expressions[`${v}`]?.() ?? v;
      });

      // entityApi.patch(row.id, patchPayload)
      console.log({ patchPayload });

      return Promise.resolve();
    },
    (row: any, self: ColumnAction) => (
      <DataActionComponent columns={cols} dataAction={action} row={row} columnAction={self} />
    )));
  });
}
