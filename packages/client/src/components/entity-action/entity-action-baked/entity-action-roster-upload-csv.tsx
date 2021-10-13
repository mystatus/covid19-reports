import React, {
  ChangeEvent,
  useRef,
} from 'react';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { UserSelector } from '../../../selectors/user.selector';
import { EntityActionTableButtonBakedProps } from '../../../entity-actions/entity-action.types';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { formatErrorMessage } from '../../../utility/errors';
import { Modal } from '../../../actions/modal.actions';
import { RosterClient } from '../../../client/roster.client';
import { EntityActionButton } from '../entity-action-button';

export function EntityActionRosterUploadCsv(props: EntityActionTableButtonBakedProps) {
  const { action, renderAs, onClick, onComplete } = props;
  const dispatch = useAppDispatch();

  const org = useAppSelector(UserSelector.org)!;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files[0] == null) {
      if (onComplete) {
        onComplete();
      }
      return;
    }

    let uploadCount: number;
    try {
      const data = await RosterClient.uploadRosterEntries(org.id, e.target.files[0]);
      uploadCount = data.count;
    } catch (err) {
      const message = formatErrorMessage(err);
      void dispatch(Modal.alert('Upload Error', message));
      return;
    } finally {
      // Clear the file input value.
      fileInputRef.current!.value = '';

      if (onComplete) {
        onComplete();
      }
    }

    void dispatch(Modal.alert('Upload Successful', `Successfully uploaded ${uploadCount} roster entries.`));
  };

  return (
    <>
      <input
        accept="text/csv"
        id="raised-button-file"
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileInputChange}
        onAbort={onComplete}
      />

      <label htmlFor="raised-button-file">
        <EntityActionButton
          action={action}
          renderAs={renderAs}
          onClick={onClick}
        />
      </label>
    </>
  );
}
