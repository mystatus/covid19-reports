import {
  Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableHead, TableRow,
  IconButton, TableFooter, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText,
} from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AppFrame } from '../../../actions/app-frame.actions';
import { Roster } from '../../../actions/roster.actions';
import useStyles from './roster-page.styles';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import { ApiRosterEntry } from '../../../models/api-response';
import { AlertDialog, AlertDialogProps } from '../../alert-dialog/alert-dialog';
import { EditRosterEntryDialog, EditRosterEntryDialogProps } from './edit-roster-entry-dialog';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';

interface CountResponse {
  count: number
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const classes = useStyles();
  const {
    count, page, rowsPerPage, onChangePage,
  } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.tableFooter}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

export const RosterPage = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const fileInputRef = React.createRef<HTMLInputElement>();

  const [rows, setRows] = useState<ApiRosterEntry[]>([]);
  const [page, setPage] = useState(0);
  const [rosterSize, setRosterSize] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRosterEntry, setSelectedRosterEntry] = useState<ApiRosterEntry>();
  const [alertDialogProps, setAlertDialogProps] = useState<AlertDialogProps>({ open: false });
  const [deleteRosterEntryDialogOpen, setDeleteRosterEntryDialogOpen] = useState(false);
  const [editRosterEntryDialogProps, setEditRosterEntryDialogProps] = useState<EditRosterEntryDialogProps>({ open: false });
  const [deleteRosterEntryLoading, setDeleteRosterEntryLoading] = useState(false);

  const orgId = useSelector<AppState, UserState>(state => state.user).activeRole?.org?.id;

  const handleChangePage = async (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    const response = await fetch(`api/roster/${orgId}?limit=${rowsPerPage}&page=${newPage}`);
    const rosterResponse = (await response.json()) as ApiRosterEntry[];
    setPage(newPage);
    setRows(rosterResponse);
  };

  async function initializeTable() {

    dispatch(AppFrame.setPageLoading(true));

    const countData = (await axios.get(`api/roster/${orgId}/count`)).data as CountResponse;
    setRosterSize(countData.count);
    await handleChangePage(null, 0);

    dispatch(AppFrame.setPageLoading(false));

  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
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
        initializeTable();
      }
    }));
  }

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    const response = await fetch(`api/roster/${orgId}?limit=${newRowsPerPage}&page=0`);
    const rosterResponse = (await response.json()) as ApiRosterEntry[];
    setPage(0);
    setRows(rosterResponse);
    setRowsPerPage(newRowsPerPage);
  };

  const editButtonClicked = async (rosterEntry: ApiRosterEntry) => {
    setSelectedRosterEntry(rosterEntry);
    setEditRosterEntryDialogProps({
      open: true,
      orgId,
      rosterEntry,
      onClose: async () => {
        setEditRosterEntryDialogProps({ open: false });
        setSelectedRosterEntry(undefined);
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
      onClose: async () => {
        setEditRosterEntryDialogProps({ open: false });
        setSelectedRosterEntry(undefined);
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

  function deleteButtonClicked(rosterEntry: ApiRosterEntry) {
    setSelectedRosterEntry(rosterEntry);
    setDeleteRosterEntryDialogOpen(true);
  }

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
      await initializeTable();
    }
  };

  const cancelDeleteRosterEntryDialog = () => {
    setDeleteRosterEntryDialogOpen(false);
    setSelectedRosterEntry(undefined);
  };

  useEffect(() => { initializeTable().then(); }, []);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
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

          <Button
            type="button"
            size="large"
            startIcon={<GetAppIcon />}
            href={`api/roster/${orgId}/template`}
          >
            Download CSV Template
          </Button>

          <a href={`api/roster/${orgId}/export`} download>
            <Button
              type="button"
              size="large"
              startIcon={<GetAppIcon />}
              className={classes.fillWidth}
            >
              Export to CSV
            </Button>
          </a>

          <Button
            className={classes.addRosterEntryButton}
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
            <TableHead>
              <TableRow>
                <TableCell>EDIPI</TableCell>
                <TableCell>Rate/Rank</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.edipi}>
                  <TableCell component="th" scope="row">
                    {row.edipi}
                  </TableCell>
                  <TableCell>{row.rateRank}</TableCell>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell className={classes.tableButtons}>
                    <Button
                      className={classes.editRosterEntryButton}
                      variant="outlined"
                      onClick={() => editButtonClicked(row)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      className={classes.deleteRosterEntryButton}
                      variant="outlined"
                      onClick={() => deleteButtonClicked(row)}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  count={rosterSize}
                  colSpan={5}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
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
          <DialogTitle id="alert-dialog-title">Remove User</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Are you sure you want to remove '${selectedRosterEntry?.firstName} ${selectedRosterEntry?.lastName}' 
                (EPIDI: ${selectedRosterEntry?.edipi}) from this roster?`}
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
        <EditRosterEntryDialog open={editRosterEntryDialogProps.open} orgId={editRosterEntryDialogProps.orgId} rosterEntry={selectedRosterEntry} onClose={editRosterEntryDialogProps.onClose} onError={editRosterEntryDialogProps.onError} />
      )}
      {alertDialogProps.open && (
        <AlertDialog open={alertDialogProps.open} title={alertDialogProps.title} message={alertDialogProps.message} onClose={alertDialogProps.onClose} />
      )}
    </main>
  );
};
