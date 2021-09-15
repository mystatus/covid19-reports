import { store } from '../../store';
import { RosterClient } from '../../client/roster.client';
import { BulkAction } from '../actions';
import { Modal } from '../../actions/modal.actions';
import { formatErrorMessage } from '../../utility/errors';
import { downloadFile } from '../../utility/download';
import { UserSelector } from '../../selectors/user.selector';

export const downloadCSVTemplate = new BulkAction(
  {
    name: 'downloadCSVTemplate',
    displayName: 'Download CSV Template',
    phi: false,
    pii: false,
  },
  async () => {
    try {
      const orgId = UserSelector.orgId(store.getState())!;
      const data = await RosterClient.getRosterTemplate(orgId);
      downloadFile(data, 'roster-template', 'csv');
      return Promise.resolve();
    } catch (error) {
      void store.dispatch(Modal.alert('CSV Template Download', formatErrorMessage(error, 'Unable to download CSV template')));
      return Promise.reject();
    }
  },
);
