import React, { useState } from 'react';
import { ColumnInfo, ColumnType, ColumnValue, EntityType } from '@covid19-reports/shared';
import { ButtonAsyncSpinner } from '../components/buttons/button-async-spinner';
import { ColumnAction, defer, executeAction, getRegistry } from './actions';
import { QueryBuilderValueEditor } from '../components/query-builder/query-builder-value-editor';
import { QueryRow } from '../utility/query-builder-utils';
import { store } from '../store';
import { entityApi } from '../api/entity.api';
import { UserSelector } from '../selectors/user.selector';

const registry = getRegistry('roster');

const expressions: Record<string, () => ColumnValue> = {
  now: () => new Date().toISOString(),
};

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
  name: 'roster-remove-from-rom',
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


const DataActionComponent = ({ columns, dataAction, entityType, row, columnAction }: { columns: ColumnInfo[]; dataAction: DataAction; entityType: EntityType; row: any; columnAction: ColumnAction }) => {
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
      <ButtonAsyncSpinner onClick={() => executeAction(entityType, columnAction, row)}>
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
            return executeAction(entityType, columnAction, row, data);
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


export function registerActionsForUpdatableColumns(columns: ColumnInfo[], entityType: EntityType) {
  dataActionsResponse.forEach(action => {
    // this is likely inadequate, needs fully qualified?
    const cols = columns.filter(c => action.operations.some(a => a.field === c.name)).filter(c => c.updatable);

    registry.register(new ColumnAction({
      name: action.name,
      displayName: action.displayName,
      pii: cols.some(c => c.pii),
      phi: cols.some(c => c.phi),
      canMenu: action.renderType !== 'editor',
      refetchEntities: true,
    },
    // eslint-disable-next-line require-await
    (async (row: any, data?: any) => {
      const deferred = defer();
      const patchPayload: Record<string, ColumnValue> = {};

      action.operations.forEach(({ field, value }) => {
        const v = value ?? data?.[field];
        patchPayload[field] = expressions[`${v}`]?.() ?? v;
      });
      const orgId = UserSelector.orgId(store.getState())!;
      const endpoint = entityApi[entityType].endpoints.patch;
      await store.dispatch(endpoint.initiate({
        orgId,
        rowId: row.id,
        payload: patchPayload,
      }));

      deferred.resolve(null);
      return deferred;
    }),
    function render(this: ColumnAction, row: any) {
      return (
        <DataActionComponent columns={cols} dataAction={action} entityType={entityType} row={row} columnAction={this} />
      );
    }));
  });
}
