import React, { useEffect, useState } from 'react';
import { RosterClient } from 'client/src/client/roster.client';
import { ButtonAsyncSpinner } from 'client/src/components/buttons/button-async-spinner';
import { store } from '../../store';
import { ActionExecutionContext, ColumnAction, defer, executeAction } from '../actions';
import { UserSelector } from '../../selectors/user.selector';
import {
  EditRosterEntryDialog,
  EditRosterEntryDialogProps,
} from '../../components/pages/roster-page/edit-roster-entry-dialog';

function EditRosterEntry({ onClose, onError, open, row }: {
  onClose?: () => void;
  onError?: (error: string) => void;
  open: boolean;
  row: any;
}) {
  const org = UserSelector.org(store.getState())!;
  const [editRosterEntryDialogProps, setEditRosterEntryDialogProps] = useState<EditRosterEntryDialogProps>({ open: false });

  useEffect(() => {
    void (async () => {
      const rosterColumnInfos = await RosterClient.getAllowedRosterColumnsInfo(org.id);

      setEditRosterEntryDialogProps({
        open,
        orgId: org.id,
        rosterColumnInfos,
        rosterEntry: row,
        prepopulated: row,
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

export const editRosterEntry = new ColumnAction(
  {
    name: 'editRosterEntry',
    displayName: 'Edit Roster Entry',
    phi: false,
    pii: false,
    canMenu: true,
    refetchEntities: true,
    isVisible: role => Boolean(role?.canManageRoster),
  },
  (async () => {
    return defer();
  }),
  function render(this: ColumnAction, row: any) {
    return (
      <ButtonAsyncSpinner onClick={() => executeAction('roster', this, row)}>
        Edit
      </ButtonAsyncSpinner>
    );
  },
  ((exectionContext: ActionExecutionContext) => {
    return (
      <EditRosterEntry
        open
        onClose={() => {
          exectionContext.deferred.resolve(true);
        }}
        onError={(error: string) => {
          exectionContext.deferred.reject(error);
        }}
        row={exectionContext.entity}
      />
    );
  }),
);
