import React, { ChangeEvent, useEffect, useRef } from 'react';
import { useAppDispatch } from 'client/src/hooks/use-app-dispatch';
import { RosterClient } from 'client/src/client/roster.client';
import { useAppSelector } from 'client/src/hooks/use-app-selector';
import { ActionExecutionContext, BulkAction, defer } from '../actions';
import { Modal } from '../../actions/modal.actions';
import { formatErrorMessage } from '../../utility/errors';
import { UserSelector } from '../../selectors/user.selector';

function UploadCSV({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const org = useAppSelector(UserSelector.org)!;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const orgId = org.id;

  function focusEvent(this: HTMLInputElement) {
    const self = this;
    setTimeout(() => {
      if (!self.files?.[0]) {
        onClose();
      }
    }, 1000);
  }

  const handleFileInputBlur = () => {
    fileInputRef.current!.addEventListener('focus', focusEvent);
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files[0] == null) {
      onClose();
      return;
    }

    let uploadCount: number;
    try {
      const data = await RosterClient.uploadRosterEntries(orgId, e.target.files[0]);
      uploadCount = data.count;
    } catch (err) {
      const message = formatErrorMessage(err);
      void dispatch(Modal.alert('Upload Error', message));
      return;
    } finally {
      // Clear the file input value.
      fileInputRef.current!.value = '';
      onClose();
    }

    void dispatch(Modal.alert('Upload Successful', `Successfully uploaded ${uploadCount} roster entries.`));
  };

  useEffect(() => {
    fileInputRef.current?.focus();
    fileInputRef.current?.click();
  }, []);

  return (
    <input
      accept="text/csv"
      id="raised-button-file"
      type="file"
      style={{ position: 'absolute', width: 1, height: 1, opacity: 0.01 }}
      ref={fileInputRef}
      onBlur={handleFileInputBlur}
      onChange={handleFileInputChange}
    />
  );
}

export const uploadCSV = new BulkAction(
  {
    name: 'uploadCSV',
    displayName: 'Upload CSV',
    phi: false,
    pii: false,
    refetchEntities: true,
  },
  async () => {
    return defer();
  },
  ((executionContext: ActionExecutionContext) => {
    return (
      <UploadCSV
        onClose={() => {
          executionContext.deferred.resolve(true);
        }}
      />
    );
  }),
);
