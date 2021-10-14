import React, {
  useCallback,
} from 'react';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { UserSelector } from '../../../selectors/user.selector';
import { entityApi } from '../../../api/entity.api';
import { EntityActionColumnButtonBakedProps } from '../../../entity-actions/entity-action.types';
import { EntityActionButton } from '../entity-action-button';
import { Modal } from '../../../actions/modal.actions';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useEffectError } from '../../../hooks/use-effect-error';

export function EntityActionRosterDeleteEntry(props: EntityActionColumnButtonBakedProps<'roster'>) {
  const { action, row, renderAs, onClick, onComplete } = props;

  const dispatch = useAppDispatch();

  const orgId = useAppSelector(UserSelector.orgId)!;

  const [deleteEntity, {
    error: deleteEntityError,
  }] = entityApi.roster.useDeleteEntityMutation();

  useEffectError(deleteEntityError, 'Delete Entity', 'Failed to delete entity');

  const handleClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement | HTMLLIElement>) => {
    if (onClick) {
      onClick(event);
    }

    const title = 'Delete Roster Entry';
    const message = 'Are you sure you want to delete this roster entry?';
    const result = await dispatch(Modal.confirm(title, message, {
      destructive: true,
      confirmText: 'Delete',
    }));

    if (!result?.button?.value) {
      return;
    }

    await deleteEntity({
      orgId,
      entityId: row.id,
    });

    if (onComplete) {
      onComplete();
    }
  }, [deleteEntity, dispatch, onClick, onComplete, orgId, row.id]);

  return (
    <EntityActionButton
      action={action}
      renderAs={renderAs}
      onClick={handleClick}
    />
  );
}
