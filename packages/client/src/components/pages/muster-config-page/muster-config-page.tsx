import _ from 'lodash';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { MusterConfigPageHelp } from './muster-config-page-help';
import useStyles from './muster-config-page.styles';
import { EditMusterConfigDialog, EditMusterConfigDialogProps } from './edit-muster-config-dialog';
import PageHeader from '../../page-header/page-header';
import { Modal } from '../../../actions/modal.actions';
import { formatErrorMessage } from '../../../utility/errors';
import { UserSelector } from '../../../selectors/user.selector';
import { ReportSchema } from '../../../actions/report-schema.actions';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { Dialog } from '../../dialog/dialog';
import { ApiMusterConfiguration, MusterFilter } from '../../../models/api-response';
import { MusterSelector } from '../../../selectors/muster.selector';
import { Muster } from '../../../actions/muster.actions';
import { MusterClient } from '../../../client/muster.client';
import { musterConfigurationToString } from '../../../utility/muster-utils';
import { SavedFilter } from '../../../actions/saved-filter.actions';

interface MusterConfigMenuState {
  anchor: HTMLElement | null;
  musterConfig?: ApiMusterConfiguration;
}

export const MusterConfigPage = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const org = useAppSelector(UserSelector.org)!;
  const orgId = org.id;

  const musterConfigs = useAppSelector(MusterSelector.all);
  const initialEditMusterConfigState = { open: false };
  const [musterConfigToDelete, setMusterConfigToDelete] = useState<null | ApiMusterConfiguration>(null);
  const [editMusterConfigDialogProps, setEditMusterConfigDialogProps] = useState<EditMusterConfigDialogProps>(initialEditMusterConfigState);
  const [musterConfigMenu, setMusterConfigMenu] = React.useState<MusterConfigMenuState>({ anchor: null });

  const initializeTable = React.useCallback(async () => {
    if (orgId) {
      await Promise.all([
        dispatch(Muster.fetch(orgId)),
        dispatch(ReportSchema.fetch(orgId)),
        dispatch(SavedFilter.fetch(orgId, 'roster')),
      ]);
    }
  }, [orgId, dispatch]);

  const newMusterConfig = () => {
    setEditMusterConfigDialogProps({
      open: true,
      orgId,
      onClose: async () => {
        setEditMusterConfigDialogProps(initialEditMusterConfigState);
        await initializeTable();
      },
      onError: (message: string) => {
        void dispatch(Modal.alert('Add Muster Configuration', `Unable to add muster configuration: ${message}`));
      },
    });
  };

  const editMusterConfig = () => {
    if (musterConfigMenu.musterConfig) {
      setMusterConfigMenu({ anchor: null });
      setEditMusterConfigDialogProps({
        open: true,
        musterConfig: musterConfigMenu.musterConfig,
        orgId,
        onClose: async () => {
          setEditMusterConfigDialogProps(initialEditMusterConfigState);
          await initializeTable();
        },
        onError: (message: string) => {
          void dispatch(Modal.alert('Edit Muster Configuration', `Unable to edit muster configuration: ${message}`));
        },
      });
    }
  };

  const deleteMusterConfig = () => {
    if (musterConfigMenu.musterConfig) {
      setMusterConfigMenu({ anchor: null });
      setMusterConfigToDelete(musterConfigMenu.musterConfig);
    }
  };

  const confirmDeleteMusterConfig = async () => {
    if (!musterConfigToDelete) {
      return;
    }
    try {
      await MusterClient.deleteMusterConfig(orgId, musterConfigToDelete.id);
    } catch (error) {
      void dispatch(Modal.alert('Delete Muster Configuration', formatErrorMessage(error, 'Unable to delete muster configuration')));
    }
    setMusterConfigToDelete(null);
    await initializeTable();
  };

  const cancelDeleteMusterConfigDialog = () => {
    setMusterConfigToDelete(null);
  };

  const handleMusterConfigMenuClick = (musterConfig: ApiMusterConfiguration) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setMusterConfigMenu({ anchor: event.currentTarget, musterConfig });
  };

  const handleMusterConfigMenuClose = () => {
    setMusterConfigMenu({ anchor: null });
  };

  const filtersToString = (filters: MusterFilter[]) => {
    return _.chain(filters)
      .map(f => f.filter.name)
      .sortBy()
      .value()
      .join(', ');
  };

  useEffect(() => { void initializeTable(); }, [initializeTable]);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <PageHeader
          title="Muster Configuration"
          help={{
            contentComponent: MusterConfigPageHelp,
            cardId: 'musterConfigPage',
          }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Muster Configurations" />
              <CardActions>
                <Button
                  size="large"
                  variant="text"
                  color="primary"
                  onClick={newMusterConfig}
                  startIcon={<AddCircleIcon />}
                >
                  Add New Muster Configuration
                </Button>
              </CardActions>
              <CardContent>
                <TableContainer className={classes.table}>
                  <Table aria-label="muster table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Muster Requirements</TableCell>
                        <TableCell>Filters</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {musterConfigs.map(musterConfig => (
                        <TableRow key={musterConfig.id}>
                          <TableCell className={classes.musterConfiguration}>
                            { musterConfigurationToString(musterConfig) }
                          </TableCell>
                          <TableCell>
                            { musterConfig.filters.length > 0 ? filtersToString(musterConfig.filters) : 'Everyone' }
                          </TableCell>
                          <TableCell className={classes.iconCell}>
                            <IconButton
                              aria-label="muster actions"
                              aria-controls={`muster-${musterConfig.id}-menu`}
                              aria-haspopup="true"
                              onClick={handleMusterConfigMenuClick(musterConfig)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <Menu
                        id="muster-menu"
                        anchorEl={musterConfigMenu.anchor}
                        keepMounted
                        open={Boolean(musterConfigMenu.musterConfig)}
                        onClose={handleMusterConfigMenuClose}
                      >
                        <MenuItem onClick={editMusterConfig}>Edit Muster Configuration</MenuItem>
                        <MenuItem onClick={deleteMusterConfig}>Delete Muster Configuration</MenuItem>
                      </Menu>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {Boolean(musterConfigToDelete) && (
        <Dialog
          open={Boolean(musterConfigToDelete)}
          onClose={cancelDeleteMusterConfigDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Muster Configuration</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete the muster configuration?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeleteMusterConfig}>
              Yes
            </Button>
            <Button onClick={cancelDeleteMusterConfigDialog}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {editMusterConfigDialogProps.open && <EditMusterConfigDialog {...editMusterConfigDialogProps} />}
    </main>
  );
};
