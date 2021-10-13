import React, {
  useCallback,
} from 'react';
import _ from 'lodash';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { UserSelector } from '../../../selectors/user.selector';
import { EntityActionTableButtonBakedProps } from '../../../entity-actions/entity-action.types';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { downloadFile } from '../../../utility/download';
import { formatErrorMessage } from '../../../utility/errors';
import { Modal } from '../../../actions/modal.actions';
import { ExportClient } from '../../../client/export.client';
import { EntityActionButton } from '../entity-action-button';

export function EntityActionRosterExportCsv(props: EntityActionTableButtonBakedProps) {
  const { action, renderAs, onClick, onComplete } = props;
  const dispatch = useAppDispatch();

  const org = useAppSelector(UserSelector.org)!;

  const handleClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement | HTMLLIElement>) => {
    if (onClick) {
      onClick(event);
    }

    try {
      const data = await ExportClient.exportRosterToCsv(org.id);
      const date = new Date().toISOString();
      const filename = `${_.kebabCase(org.name)}_roster_export_${date}`;
      downloadFile(data, filename, 'csv');
    } catch (error) {
      void dispatch(Modal.alert('Roster CSV Export', formatErrorMessage(error, 'Unable to export roster to CSV')));
    }

    if (onComplete) {
      onComplete();
    }
  }, [dispatch, onClick, onComplete, org.id, org.name]);

  return (
    <EntityActionButton
      action={action}
      renderAs={renderAs}
      onClick={handleClick}
    />
  );
}
