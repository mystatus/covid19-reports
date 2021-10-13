import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box } from '@material-ui/core';
import {
  ColumnInfo,
  ColumnValue,
  QueryValueScalarType,
} from '@covid19-reports/shared';
import { useAppSelector } from '../../hooks/use-app-selector';
import { UserSelector } from '../../selectors/user.selector';
import { entityApi } from '../../api/entity.api';
import { QueryRow } from '../../utility/query-builder-utils';
import { useEffectError } from '../../hooks/use-effect-error';
import { QueryBuilderValueEditor } from '../query-builder/query-builder-value-editor';
import { ButtonWithSpinner } from '../buttons/button-with-spinner';
import { EntityActionColumnEditorItem } from '../../entity-actions/entity-action.types';

export type EntityActionColumnEditorProps = {
  action: EntityActionColumnEditorItem;
  columns: ColumnInfo[];
  row: { [columnName: string]: ColumnValue } & { id: number };
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLLIElement>) => void;
  onComplete?: () => void;
};

export function EntityActionColumnEditor(props: EntityActionColumnEditorProps) {
  const { action, columns, row, onClick, onComplete } = props;

  const orgId = useAppSelector(UserSelector.orgId)!;

  const [patchEntity, {
    error: patchEntityError,
    isLoading: patchEntityIsLoading,
  }] = entityApi[action.entityType].usePatchEntityMutation();

  const getInitialQueryRows = useCallback(() => {
    const { columnName } = action.operation;

    const column = columns.find(c => c.name === columnName);
    if (!column) {
      return undefined;
    }

    const queryRow: QueryRow = {
      field: {
        ...column,
        name: columnName,
      },
      op: '=',
      value: row[columnName] ?? '',
      expression: '',
      expressionEnabled: false,
    };

    return [queryRow];
  }, [action.operation, columns, row]);

  // HACK: Reusing query rows here for the sake of time, but this should use something more
  //  custom or generic ('op' doesn't make sense here for example).
  const [queryRows, setQueryRows] = useState<QueryRow[] | undefined>(getInitialQueryRows);

  const handleSaveClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement | HTMLLIElement>) => {
    if (onClick) {
      onClick(event);
    }

    if (!queryRows?.length) {
      return;
    }

    if (action.operation.type !== 'editorValue') {
      throw new Error(`ActionColumnEditor action operation must be of type 'editorValue'`);
    }

    const body: Record<string, ColumnValue> = {};
    queryRows.forEach(queryRow => {
      const value = queryRow.value as QueryValueScalarType;
      body[queryRow.field.name] = `${value}`;
    });

    await patchEntity({
      orgId,
      entityId: row.id as number,
      body,
    });

    if (onComplete) {
      onComplete();
    }
  }, [action.operation.type, onClick, onComplete, orgId, patchEntity, queryRows, row.id]);

  const hasChanges = useMemo(() => {
    if (!queryRows?.length) {
      return false;
    }

    const savedValue = row[action.operation.columnName];
    return queryRows[0].value !== savedValue;
  }, [action.operation.columnName, queryRows, row]);

  // Reset query rows to initial state when props such as columns change.
  useEffect(() => {
    setQueryRows(getInitialQueryRows());
  }, [getInitialQueryRows]);

  useEffectError(patchEntityError, 'Patch Entity', 'Failed to patch entity');

  if (!queryRows?.length) {
    return null;
  }

  return (
    <Box display="flex">
      <QueryBuilderValueEditor
        row={queryRows[0]}
        onChange={queryRow => setQueryRows([{ ...queryRow }])}
      />

      <Box marginLeft={2}>
        <ButtonWithSpinner
          onClick={handleSaveClick}
          loading={patchEntityIsLoading}
          disabled={!hasChanges}
        >
          Save
        </ButtonWithSpinner>
      </Box>
    </Box>
  );
}
