import React, {
  useCallback,
} from 'react';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { UserSelector } from '../../../selectors/user.selector';
import { EntityActionTableButtonBakedProps } from '../../../entity-actions/entity-action.types';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { downloadFile } from '../../../utility/download';
import { RosterClient } from '../../../client/roster.client';
import { formatErrorMessage } from '../../../utility/errors';
import { Modal } from '../../../actions/modal.actions';
import { EntityActionButton } from '../entity-action-button';

export function EntityActionRosterDownloadCsvTemplate(props: EntityActionTableButtonBakedProps) {
  const { action, renderAs, onComplete } = props;
  const dispatch = useAppDispatch();

  const orgId = useAppSelector(UserSelector.orgId)!;

  const handleClick = useCallback(async () => {
    try {
      const data = await RosterClient.getRosterTemplate(orgId);
      downloadFile(data, 'roster-template', 'csv');
    } catch (error) {
      void dispatch(Modal.alert('CSV Template Download', formatErrorMessage(error, 'Unable to download CSV template')));
    }

    if (onComplete) {
      onComplete();
    }
  }, [dispatch, onComplete, orgId]);

  return (
    <EntityActionButton
      action={action}
      renderAs={renderAs}
      onClick={handleClick}
    />
  );
}
