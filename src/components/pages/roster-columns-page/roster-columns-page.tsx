import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, {
  useEffect,
  useState,
} from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import axios from 'axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PageHeader from '../../page-header/page-header';
import { RosterColumnsPageHelp } from './roster-columns-page-help';
import useStyles from './roster-columns-page.styles';
import { ApiRosterColumnInfo, rosterColumnTypeDisplayName } from '../../../models/api-response';
import { EditColumnDialog, EditColumnDialogProps } from './edit-column-dialog';
import { AppFrame } from '../../../actions/app-frame.actions';
import { ButtonSet } from '../../buttons/button-set';
import { Modal } from '../../../actions/modal.actions';
import { formatMessage } from '../../../utility/errors';
import { UserSelector } from '../../../selectors/user.selector';

interface ColumnMenuState {
  anchor: HTMLElement | null,
  column?: ApiRosterColumnInfo,
}

export const RosterColumnsPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [columns, setColumns] = useState<ApiRosterColumnInfo[]>([]);
  const [columnToDelete, setColumnToDelete] = useState<null | ApiRosterColumnInfo>(null);
  const [editColumnDialogProps, setEditColumnDialogProps] = useState<EditColumnDialogProps>({ open: false });
  const [columnMenu, setColumnMenu] = React.useState<ColumnMenuState>({ anchor: null });

  const orgId = useSelector(UserSelector.orgId);

  const initializeTable = React.useCallback(async () => {
    dispatch(AppFrame.setPageLoading(true));
    const allColumns = (await axios.get(`api/roster/${orgId}/column`)).data as ApiRosterColumnInfo[];
    const customColumns = allColumns.filter(column => column.custom);
    setColumns(customColumns);
    dispatch(AppFrame.setPageLoading(false));
  }, [orgId, dispatch]);

  const newColumn = async () => {
    setEditColumnDialogProps({
      open: true,
      orgId,
      onClose: async () => {
        setEditColumnDialogProps({ open: false });
        await initializeTable();
      },
      onError: (message: string) => {
        dispatch(Modal.alert('Add Column', `Unable to add column: ${message}`));
      },
    });
  };

  const editColumn = () => {
    if (columnMenu.column) {
      const column = columnMenu.column;
      setColumnMenu({ anchor: null });
      setEditColumnDialogProps({
        open: true,
        column,
        orgId,
        onClose: async () => {
          setEditColumnDialogProps({ open: false });
          await initializeTable();
        },
        onError: (message: string) => {
          dispatch(Modal.alert('Edit Column', `Unable to edit column: ${message}`)).then();
        },
      });
    }
  };

  const deleteColumn = () => {
    if (columnMenu.column) {
      const column = columnMenu.column;
      setColumnMenu({ anchor: null });
      setColumnToDelete(column);
    }
  };

  const confirmDeleteColumn = async () => {
    if (!columnToDelete) {
      return;
    }
    try {
      await axios.delete(`api/roster/${orgId}/column/${columnToDelete.name}`);
    } catch (error) {
      dispatch(Modal.alert('Delete Column', formatMessage(error, 'Unable to delete column'))).then();
    }
    setColumnToDelete(null);
    await initializeTable();
  };

  const cancelDeleteColumnDialog = () => {
    setColumnToDelete(null);
  };

  const handleColumnMenuClick = (column: ApiRosterColumnInfo) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setColumnMenu({ anchor: event.currentTarget, column });
  };

  const handleColumnMenuClose = () => {
    setColumnMenu({ anchor: null });
  };

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <PageHeader
          title="Custom Roster Columns"
          help={{
            contentComponent: RosterColumnsPageHelp,
            cardId: 'rosterColumnsPage',
          }}
        />
        <ButtonSet>
          <Button
            size="large"
            variant="text"
            color="primary"
            onClick={newColumn}
            startIcon={<AddCircleIcon />}
          >
            Add New Column
          </Button>
        </ButtonSet>
        <TableContainer className={classes.table} component={Paper}>
          <Table aria-label="column table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell className={classes.iconCell}>PII</TableCell>
                <TableCell className={classes.iconCell}>PHI</TableCell>
                <TableCell className={classes.iconCell}>Required</TableCell>
                <TableCell className={classes.iconCell} />
              </TableRow>
            </TableHead>
            <TableBody>
              {columns.map(column => (
                <TableRow key={column.name}>
                  <TableCell>{column.displayName}</TableCell>
                  <TableCell className={classes.typeColumn}>{rosterColumnTypeDisplayName(column.type)}</TableCell>
                  <TableCell className={classes.iconCell}>
                    {column.pii ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className={classes.iconCell}>
                    {column.phi ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className={classes.iconCell}>
                    {column.required ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className={classes.iconCell}>
                    <IconButton
                      aria-label="workspace actions"
                      aria-controls={`workspace-${column.name}-menu`}
                      aria-haspopup="true"
                      onClick={handleColumnMenuClick(column)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <Menu
                id="column-menu"
                anchorEl={columnMenu.anchor}
                keepMounted
                open={Boolean(columnMenu.column)}
                onClose={handleColumnMenuClose}
              >
                <MenuItem onClick={editColumn}>Edit Column</MenuItem>
                <MenuItem onClick={deleteColumn}>Delete Column</MenuItem>
              </Menu>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      {Boolean(columnToDelete) && (
        <Dialog
          open={Boolean(columnToDelete)}
          onClose={cancelDeleteColumnDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Roster Column</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Are you sure you want to delete the '${columnToDelete?.displayName}' roster column?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeleteColumn}>
              Yes
            </Button>
            <Button onClick={cancelDeleteColumnDialog}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {editColumnDialogProps.open && (
        <EditColumnDialog
          open={editColumnDialogProps.open}
          orgId={editColumnDialogProps.orgId}
          column={editColumnDialogProps.column}
          onClose={editColumnDialogProps.onClose}
          onError={editColumnDialogProps.onError}
        />
      )}
    </main>
  );
};
