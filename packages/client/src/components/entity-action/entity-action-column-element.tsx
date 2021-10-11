import { ColumnInfo } from '@covid19-reports/shared';
import React from 'react';
import {
  EntityActionColumnItem,
  EntityActionRenderAs,
} from '../../entity-actions/entity-action.types';
import { EntityTableRow } from '../tables/table-custom-columns-content';
import { EntityActionColumnButton } from './entity-action-column-button';
import { EntityActionColumnEditor } from './entity-action-column-editor';
import { entityActionBakedColumnComponents } from '../../entity-actions/entity-action-baked';

export type EntityActionColumnProps = {
  action: EntityActionColumnItem | undefined;
  columns: ColumnInfo[];
  rows: EntityTableRow<any>[];
  row: EntityTableRow<any>;
  renderAs: EntityActionRenderAs;
  onComplete?: () => void;
};

export function EntityActionColumnElement(props: EntityActionColumnProps) {
  const { action, columns, rows, row, renderAs, onComplete } = props;

  if (!action) {
    return <div>Err: Action Not Found</div>;
  }

  switch (action.type) {
    case 'column-button-item':
      return (
        <EntityActionColumnButton
          action={action}
          row={row}
          renderAs={renderAs}
          onComplete={onComplete}
        />
      );
    case 'column-editor-item':
      return (
        <EntityActionColumnEditor
          action={action}
          columns={columns}
          row={row}
          onComplete={onComplete}
        />
      );
    case 'column-button-item-baked': {
      const EntityActionColumnBakedButton = entityActionBakedColumnComponents[action.id];
      return (
        <EntityActionColumnBakedButton
          action={action}
          columns={columns}
          rows={rows}
          row={row}
          renderAs={renderAs}
          onComplete={onComplete}
        />
      );
    }
    default:
      return <div>Err: Unknown Action Type</div>;
  }
}
