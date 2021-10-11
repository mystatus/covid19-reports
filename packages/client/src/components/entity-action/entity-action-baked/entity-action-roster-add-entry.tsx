import React, {
  useCallback,
  useState,
} from 'react';
import { EditRosterEntryDialog } from '../../pages/roster-page/edit-roster-entry-dialog';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { UserSelector } from '../../../selectors/user.selector';
import { entityApi } from '../../../api/entity.api';
import { EntityActionTableButtonBakedProps } from '../../../entity-actions/entity-action.types';
import { EntityActionButton } from '../entity-action-button';

export function EntityActionRosterAddEntry(props: EntityActionTableButtonBakedProps) {
  const { action, renderAs, onComplete } = props;

  const orgId = useAppSelector(UserSelector.orgId)!;

  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: rosterColumnInfos,
  } = entityApi.roster.useGetAllowedColumnsInfoQuery({ orgId });

  const handleClick = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDialogOpen(false);

    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  return (
    <>
      <EntityActionButton
        action={action}
        renderAs={renderAs}
        onClick={handleClick}
      />

      <EditRosterEntryDialog
        open={dialogOpen}
        orgId={orgId}
        rosterColumnInfos={rosterColumnInfos}
        onClose={handleClose}
      />
    </>
  );
}
