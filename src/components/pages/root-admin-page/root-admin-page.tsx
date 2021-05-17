import {
  Button,
  Container,
} from '@material-ui/core';
import BackupIcon from '@material-ui/icons/Backup';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import axios from 'axios';
import React, {
  ChangeEvent,
  createRef,
  useState,
} from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { Modal } from '../../../actions/modal.actions';
import { RosterClient } from '../../../client';
import { UserSelector } from '../../../selectors/user.selector';
import { downloadFile } from '../../../utility/download';
import { formatErrorMessage } from '../../../utility/errors';
import { ButtonSet } from '../../buttons/button-set';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import PageHeader from '../../page-header/page-header';
import { PageRoot } from '../../page-root/page-root';

export const RootAdminPage = () => {
  const dispatch = useDispatch();

  const fileInputRef = createRef<HTMLInputElement>();
  const orgId = useSelector(UserSelector.org)!.id;

  const [rosterHistoryCsvTemplateLoading, setRosterHistoryCsvTemplateLoading] = useState(false);

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files[0] == null) {
      return;
    }

    try {
      await RosterClient.uploadHistory(orgId, e.target.files[0]);
    } catch (err) {
      const message = formatErrorMessage(err);
      dispatch(Modal.alert('Upload Error', message)).then();
      return;
    } finally {
      // Clear the file input value.
      fileInputRef.current!.value = '';
    }

    dispatch(Modal.alert('Upload Successful', `Successfully uploaded roster history!`)).then();
  };

  const downloadRosterHistoryCsvTemplate = async () => {
    try {
      setRosterHistoryCsvTemplateLoading(true);

      const response = await axios({
        url: `api/roster-history/${orgId}/template`,
        method: 'GET',
        responseType: 'blob',
      });

      downloadFile(response.data, 'roster-history-template', 'csv');
    } catch (error) {
      dispatch(Modal.alert('CSV Template Download', formatErrorMessage(error, 'Unable to download CSV template'))).then();
    } finally {
      setRosterHistoryCsvTemplateLoading(false);
    }
  };

  return (
    <PageRoot>
      <Container maxWidth="md">
        <PageHeader
          title="Root Admin"
        />

        <ButtonSet>
          <input
            accept="text/csv"
            id="raised-button-file"
            type="file"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileInputChange}
          />
          <label
            htmlFor="raised-button-file"
          >
            <Button
              size="large"
              variant="text"
              startIcon={<BackupIcon />}
              component="span"
            >
              Upload Roster History CSV
            </Button>
          </label>

          <ButtonWithSpinner
            type="button"
            size="large"
            variant="text"
            startIcon={<CloudDownloadIcon />}
            onClick={() => downloadRosterHistoryCsvTemplate()}
            loading={rosterHistoryCsvTemplateLoading}
          >
            Download Roster History CSV Template
          </ButtonWithSpinner>
        </ButtonSet>
      </Container>
    </PageRoot>
  );
};
