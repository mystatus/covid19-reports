import _ from 'lodash';
import { ExportClient } from 'client/src/client/export.client';
import { store } from '../../store';
import { BulkAction } from '../actions';
import { Modal } from '../../actions/modal.actions';
import { formatErrorMessage } from '../../utility/errors';
import { downloadFile } from '../../utility/download';
import { UserSelector } from '../../selectors/user.selector';

export const exportCSV = new BulkAction(
  {
    name: 'exportCSV',
    displayName: 'Export CSV',
    phi: false,
    pii: false,
  },
  async () => {
    try {
      const org = UserSelector.org(store.getState())!;
      const data = await ExportClient.exportRosterToCsv(org.id);
      const date = new Date().toISOString();
      const filename = `${_.kebabCase(org.name)}_roster_export_${date}`;
      downloadFile(data, filename, 'csv');
      return Promise.resolve();
    } catch (error) {
      void store.dispatch(Modal.alert('Roster CSV Export', formatErrorMessage(error, 'Unable to export roster to CSV')));
      return Promise.reject();
    }
  },
);