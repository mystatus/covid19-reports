import React, { useCallback } from 'react';
import { ColumnValue } from '@covid19-reports/shared';
import {
  EntityActionColumnButtonItem,
  EntityActionRenderAs,
} from '../../entity-actions/entity-action.types';
import { useAppSelector } from '../../hooks/use-app-selector';
import { UserSelector } from '../../selectors/user.selector';
import { entityApi } from '../../api/entity.api';
import { useEffectError } from '../../hooks/use-effect-error';
import { getEntityActionOperationValue } from '../../entity-actions/entity-action-utils';
import { EntityActionButton } from './entity-action-button';

export type EntityActionColumnButtonProps = {
  action: EntityActionColumnButtonItem;
  row: { [columnName: string]: ColumnValue } & { id: number };
  renderAs: EntityActionRenderAs;
  onComplete?: () => void;
};

export function EntityActionColumnButton(props: EntityActionColumnButtonProps) {
  const { action, row, renderAs, onComplete } = props;

  const orgId = useAppSelector(UserSelector.orgId)!;

  const [patchEntity, {
    error: patchEntityError,
    isLoading: patchEntityIsLoading,
  }] = entityApi[action.entityType].usePatchEntityMutation();

  const handleClick = useCallback(async () => {
    if (action.operation.type === 'editorValue') {
      throw new Error(`ActionColumnButton cannot have action operation of type 'editorValue'`);
    }

    const body: Record<string, ColumnValue> = {};
    const value = getEntityActionOperationValue(action.operation);
    if (value) {
      body[action.operation.columnName] = `${value}`;
    }

    await patchEntity({
      orgId,
      entityId: row.id,
      body,
    });

    if (onComplete) {
      onComplete();
    }
  }, [action.operation, onComplete, orgId, patchEntity, row.id]);

  useEffectError(patchEntityError, 'Patch Entity', 'Failed to patch entity');

  return (
    <EntityActionButton
      action={action}
      renderAs={renderAs}
      onClick={handleClick}
      loading={patchEntityIsLoading}
    />
  );
}
