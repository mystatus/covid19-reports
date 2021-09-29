import React, { useEffect } from 'react';
import { RosterClient } from 'client/src/client/roster.client';
import { store } from '../../store';
import { ActionExecutionContext, BulkAction, defer } from '../actions';
import { UserSelector } from '../../selectors/user.selector';
import {
  EditRosterEntryDialog,
  EditRosterEntryDialogProps,
} from '../../components/pages/roster-page/edit-roster-entry-dialog';

function AddRosterEntry({ onClose, onError, open }: {
  onClose?: () => void;
  onError?: (error: string) => void;
  open: boolean;
}) {
  const org = UserSelector.org(store.getState())!;
  const [editRosterEntryDialogProps, setEditRosterEntryDialogProps] = React.useState<EditRosterEntryDialogProps>({ open: false });

  useEffect(() => {
    void (async () => {
      const rosterColumnInfos = await RosterClient.getAllowedRosterColumnsInfo(org.id);

      setEditRosterEntryDialogProps({
        open,
        orgId: org.id,
        rosterColumnInfos,
        onClose,
        onError,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (editRosterEntryDialogProps.open) {
    return <EditRosterEntryDialog {...editRosterEntryDialogProps} />;
  }
  return null;
}

export const addRosterEntry = new BulkAction(
  {
    name: 'addRosterEntry',
    displayName: 'Add Roster Entry',
    phi: false,
    pii: false,
    refetchEntities: true,
  },
  // eslint-disable-next-line require-await
  (async () => {
    return defer();
  }),
  (executionContext: ActionExecutionContext) => {
    return (
      <AddRosterEntry
        open
        onClose={() => {
          executionContext.deferred.resolve(true);
        }}
        onError={(error: string) => {
          executionContext.deferred.reject(error);
        }}
      />
    );
  },
);
