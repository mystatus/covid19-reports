import {
  Button, Container, Paper, Table, TableContainer, TableRow, TableFooter,
  DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import React, {
  ChangeEvent, MouseEvent, useCallback, useEffect, useState,
} from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AppFrame } from '../../../actions/app-frame.actions';
import { Roster } from '../../../actions/roster.actions';
import { getNewPageIndex } from '../../../utility/table';
import { TableCustomColumnsContent } from '../../tables/table-custom-columns-content';
import { TablePagination } from '../../tables/table-pagination/table-pagination';
import useStyles from './roster-page.styles';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import { ApiRosterEntry, ApiRosterColumnInfo, ApiRosterPaginated } from '../../../models/api-response';
import { AlertDialog, AlertDialogProps } from '../../alert-dialog/alert-dialog';
import { EditRosterEntryDialog, EditRosterEntryDialogProps } from './edit-roster-entry-dialog';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';

export const RosterPage = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const fileInputRef = React.createRef<HTMLInputElement>();

  const maxNumColumnsToShow = 5;

  const [rows, setRows] = useState<ApiRosterEntry[]>([]);
  const [page, setPage] = useState(0);
  const [totalRowsCount, setTotalRowsCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRosterEntry, setSelectedRosterEntry] = useState<ApiRosterEntry>();
  const [alertDialogProps, setAlertDialogProps] = useState<AlertDialogProps>({ open: false });
  const [deleteRosterEntryDialogOpen, setDeleteRosterEntryDialogOpen] = useState(false);
  const [editRosterEntryDialogProps, setEditRosterEntryDialogProps] = useState<EditRosterEntryDialogProps>({ open: false });
  const [deleteRosterEntryLoading, setDeleteRosterEntryLoading] = useState(false);
  const [downloadTemplateLoading, setDownloadTemplateLoading] = useState(false);
  const [exportRosterLoading, setExportRosterLoading] = useState(false);
  const [rosterColumnInfos, setRosterColumnInfos] = useState<ApiRosterColumnInfo[]>([]);

  const orgId = useSelector<AppState, UserState>(state => state.user).activeRole?.org?.id;

  //
  // Effects
  //

  const reloadTable = useCallback(async () => {
    const response = await axios.get(`api/roster/${orgId}/?limit=${rowsPerPage}&page=${page}`);
    const data = response.data as ApiRosterPaginated;
    setRows(data.rows);
    setTotalRowsCount(data.totalRowsCount);
  }, [page, rowsPerPage, orgId]);

  const initializeRosterColumnInfo = useCallback(async () => {
    try {
      const infos = (await axios.get(`api/roster/${orgId}/info`)).data as ApiRosterColumnInfo[];
      setRosterColumnInfos(infos);
    } catch (error) {
      let message = 'Internal Server Error';
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        message = error.response.data.errors[0].message;
      }
      setAlertDialogProps({
        open: true,
        title: 'Get Roster Column Info',
        message: `Failed to get roster column info: ${message}`,
        onClose: () => { setAlertDialogProps({ open: false }); },
      });
    }
  }, [orgId]);

  const initializeTable = useCallback(async () => {
    dispatch(AppFrame.setPageLoading(true));
    await initializeRosterColumnInfo();
    await reloadTable();
    dispatch(AppFrame.setPageLoading(false));
  }, [dispatch, initializeRosterColumnInfo, reloadTable]);

  useEffect(() => {
    initializeTable().then();
  }, [initializeTable]);

  //
  // Functions
  //

  const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, pageNew: number) => {
    setPage(pageNew);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rowsPerPageNew = parseInt(event.target.value);
    const pageNew = getNewPageIndex(rowsPerPage, page, rowsPerPageNew);
    setRowsPerPage(rowsPerPageNew);
    setPage(pageNew);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files[0] == null) {
      return;
    }

    dispatch(Roster.upload(e.target.files[0], async count => {
      if (count < 0) {
        setAlertDialogProps({
          open: true,
          title: 'Upload Error',
          message: 'An error occurred while uploading roster. Please verify the roster data.',
          onClose: () => { setAlertDialogProps({ open: false }); },
        });
      } else {
        setAlertDialogProps({
          open: true,
          title: 'Upload Successful',
          message: `Successfully uploaded ${count} roster entries.`,
          onClose: () => { setAlertDialogProps({ open: false }); },
        });
        await initializeTable();
      }
    }));
  };

  const editButtonClicked = async (rosterEntry: ApiRosterEntry) => {
    setEditRosterEntryDialogProps({
      open: true,
      orgId,
      rosterColumnInfos,
      rosterEntry,
      onClose: async () => {
        setEditRosterEntryDialogProps({ open: false });
        await initializeTable();
      },
      onError: (message: string) => {
        setAlertDialogProps({
          open: true,
          title: 'Edit Roster Entry',
          message: `Unable to edit roster entry: ${message}`,
          onClose: () => { setAlertDialogProps({ open: false }); },
        });
      },
    });
  };

  const addButtonClicked = async () => {
    setEditRosterEntryDialogProps({
      open: true,
      orgId,
      rosterColumnInfos,
      onClose: async () => {
        setEditRosterEntryDialogProps({ open: false });
        await initializeTable();
      },
      onError: (message: string) => {
        setAlertDialogProps({
          open: true,
          title: 'Add Roster Entry',
          message: `Unable to add roster entry: ${message}`,
          onClose: () => { setAlertDialogProps({ open: false }); },
        });
      },
    });
  };

  const deleteButtonClicked = (rosterEntry: ApiRosterEntry) => {
    setSelectedRosterEntry(rosterEntry);
    setDeleteRosterEntryDialogOpen(true);
  };

  const deleteRosterEntry = async () => {
    try {
      setDeleteRosterEntryLoading(true);
      await axios.delete(`api/roster/${orgId}/${selectedRosterEntry!.edipi}`);
    } catch (error) {
      let message = 'Internal Server Error';
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        message = error.response.data.errors[0].message;
      }
      setAlertDialogProps({
        open: true,
        title: 'Delete Roster Entry',
        message: `Unable to delete roster entry: ${message}`,
        onClose: () => { setAlertDialogProps({ open: false }); },
      });
    } finally {
      setDeleteRosterEntryLoading(false);
      setDeleteRosterEntryDialogOpen(false);
      setSelectedRosterEntry(undefined);
      await initializeTable();
    }
  };

  const cancelDeleteRosterEntryDialog = () => {
    setDeleteRosterEntryDialogOpen(false);
    setSelectedRosterEntry(undefined);
  };

  const downloadCSVExport = async () => {
    try {
      setExportRosterLoading(true);
      await axios({
        url: `api/roster/${orgId}/export`,
        method: 'GET',
        responseType: 'blob',
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const date = new Date().toISOString();
        const filename = `org_${orgId}_roster_export_${date}.csv`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      });
    } catch (error) {
      let message = 'Internal Server Error';
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        message = error.response.data.errors[0].message;
      }
      setAlertDialogProps({
        open: true,
        title: 'Roster CSV Export',
        message: `Unable to export roster to CSV: ${message}`,
        onClose: () => { setAlertDialogProps({ open: false }); },
      });
    } finally {
      setExportRosterLoading(false);
    }
  };

  const downloadCSVTemplate = async () => {
    try {
      setDownloadTemplateLoading(true);
      await axios({
        url: `api/roster/${orgId}/template`,
        method: 'GET',
        responseType: 'blob',
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const filename = `roster-template.csv`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      });
    } catch (error) {
      let message = 'Internal Server Error';
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        message = error.response.data.errors[0].message;
      }
      setAlertDialogProps({
        open: true,
        title: 'CSV Template Download',
        message: `Unable to download CSV template: ${message}`,
        onClose: () => { setAlertDialogProps({ open: false }); },
      });
    } finally {
      setDownloadTemplateLoading(false);
    }
  };

  const getVisibleColumns = () => {
    return rosterColumnInfos.slice(0, maxNumColumnsToShow);
  };

  //
  // Render
  //

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <h1>Roster</h1>

        <div className={classes.buttons}>
          <input
            accept="text/csv"
            id="raised-button-file"
            type="file"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileInputChange}
          />
          <label htmlFor="raised-button-file">
            <Button
              size="large"
              startIcon={<PublishIcon />}
              component="span"
            >
              Upload CSV
            </Button>
          </label>

          <ButtonWithSpinner
            type="button"
            size="large"
            startIcon={<GetAppIcon />}
            onClick={() => downloadCSVTemplate()}
            loading={downloadTemplateLoading}
          >
            Download CSV Template
          </ButtonWithSpinner>

          <ButtonWithSpinner
            type="button"
            size="large"
            startIcon={<GetAppIcon />}
            onClick={() => downloadCSVExport()}
            loading={exportRosterLoading}
          >
            Export to CSV
          </ButtonWithSpinner>

          <Button
            color="primary"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={addButtonClicked}
          >
            Add
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableCustomColumnsContent
              rows={rows}
              columns={getVisibleColumns()}
              idColumn="edipi"
              rowOptions={{
                showEditButton: true,
                showDeleteButton: true,
                onEditButtonClick: editButtonClicked,
                onDeleteButtonClick: deleteButtonClicked,
              }}
            />
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={totalRowsCount}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10, 25, 50]}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Container>
      {deleteRosterEntryDialogOpen && (
        <Dialog
          open={deleteRosterEntryDialogOpen}
          onClose={cancelDeleteRosterEntryDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Remove Individual</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Are you sure you want to remove EPIDI '${selectedRosterEntry?.edipi}' from this roster?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <ButtonWithSpinner onClick={deleteRosterEntry} loading={deleteRosterEntryLoading}>
              Yes
            </ButtonWithSpinner>
            <Button onClick={cancelDeleteRosterEntryDialog}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {editRosterEntryDialogProps.open && (
        <EditRosterEntryDialog open={editRosterEntryDialogProps.open} orgId={editRosterEntryDialogProps.orgId} rosterColumnInfos={editRosterEntryDialogProps.rosterColumnInfos} rosterEntry={editRosterEntryDialogProps.rosterEntry} onClose={editRosterEntryDialogProps.onClose} onError={editRosterEntryDialogProps.onError} />
      )}
      {alertDialogProps.open && (
        <AlertDialog open={alertDialogProps.open} title={alertDialogProps.title} message={alertDialogProps.message} onClose={alertDialogProps.onClose} />
      )}
    </main>
  );
};
