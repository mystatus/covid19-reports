import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Dialog,
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
  Typography,
} from '@material-ui/core';
import React, {
  useEffect,
  useState,
} from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { UnitsPageHelp } from './units-page-help';
import useStyles from './units-page.styles';
import { ApiUnit } from '../../../models/api-response';
import {
  EditUnitDialog,
  EditUnitDialogProps,
} from './edit-unit-dialog';
import { UnitSelector } from '../../../selectors/unit.selector';
import { Unit } from '../../../actions/unit.actions';
import PageHeader from '../../page-header/page-header';
import { musterConfigurationsToStrings } from '../../../utility/muster-utils';
import { Modal } from '../../../actions/modal.actions';
import { formatErrorMessage } from '../../../utility/errors';
import {
  DefaultMusterDialog,
  DefaultMusterDialogProps,
} from './default-muster-dialog';
import { UserSelector } from '../../../selectors/user.selector';
import MusterConfigReadable from './muster-config-readable';
import { ReportSchemaSelector } from '../../../selectors/report-schema.selector';
import { ReportSchema } from '../../../actions/report-schema.actions';
import { UnitClient } from '../../../client/unit.client';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { UserActions } from '../../../slices/user.slice';
import { useAppSelector } from '../../../hooks/use-app-selector';

interface UnitMenuState {
  anchor: HTMLElement | null;
  unit?: ApiUnit;
}

export const UnitsPage = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const org = useAppSelector(UserSelector.org)!;
  const orgId = org.id;
  const defaultMusterConfiguration = org.defaultMusterConfiguration;

  const units = useAppSelector(UnitSelector.all);
  const reports = useAppSelector(ReportSchemaSelector.all);
  const initialEditUnitState = { open: false, defaultMusterConfiguration };
  const [unitToDelete, setUnitToDelete] = useState<null | ApiUnit>(null);
  const [editUnitDialogProps, setEditUnitDialogProps] = useState<EditUnitDialogProps>(initialEditUnitState);
  const [defaultMusterDialogProps, setDefaultMusterDialogProps] = useState<DefaultMusterDialogProps>({ open: false });
  const [unitMenu, setUnitMenu] = React.useState<UnitMenuState>({ anchor: null });
  const [defaultMusterSaved, setDefaultMusterSaved] = React.useState(false);

  const initializeTable = React.useCallback(async () => {
    if (orgId) {
      await dispatch(Unit.fetch(orgId));
      await dispatch(ReportSchema.fetch(orgId));
    }
  }, [orgId, dispatch]);

  const showDefaultMusterConfig = () => {
    setDefaultMusterDialogProps({
      open: true,
      onClose: async (success?: boolean) => {
        setDefaultMusterDialogProps({ open: false });
        if (success) {
          await dispatch(UserActions.refresh());
          await initializeTable();
          setDefaultMusterSaved(true);
        }
      },
      onError: (message: string) => {
        void dispatch(Modal.alert('Default Muster Configuration', `Unable edit the default muster configuration: ${message}`));
      },
    });
  };

  const newUnit = () => {
    setEditUnitDialogProps({
      open: true,
      orgId,
      defaultMusterConfiguration,
      onClose: async () => {
        setEditUnitDialogProps(initialEditUnitState);
        await initializeTable();
      },
      onError: (message: string) => {
        void dispatch(Modal.alert('Add Unit', `Unable to add unit: ${message}`));
      },
    });
  };

  const editUnit = () => {
    if (unitMenu.unit) {
      setUnitMenu({ anchor: null });
      setEditUnitDialogProps({
        open: true,
        unit: unitMenu.unit,
        defaultMusterConfiguration,
        orgId,
        onClose: async () => {
          setEditUnitDialogProps(initialEditUnitState);
          await initializeTable();
        },
        onError: (message: string) => {
          void dispatch(Modal.alert('Edit Unit', `Unable to edit unit: ${message}`));
        },
      });
    }
  };

  const deleteUnit = () => {
    if (unitMenu.unit) {
      setUnitMenu({ anchor: null });
      setUnitToDelete(unitMenu.unit);
    }
  };

  const confirmDeleteUnit = async () => {
    if (!unitToDelete) {
      return;
    }
    try {
      await UnitClient.deleteUnit(orgId, unitToDelete.id);
    } catch (error) {
      void dispatch(Modal.alert('Delete Unit', formatErrorMessage(error, 'Unable to delete unit')));
    }
    setUnitToDelete(null);
    await initializeTable();
  };

  const cancelDeleteUnitDialog = () => {
    setUnitToDelete(null);
  };

  const handleUnitMenuClick = (unit: ApiUnit) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setUnitMenu({ anchor: event.currentTarget, unit });
  };

  const handleUnitMenuClose = () => {
    setUnitMenu({ anchor: null });
  };

  useEffect(() => { void initializeTable(); }, [initializeTable]);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <PageHeader
          title="Unit Management"
          help={{
            contentComponent: UnitsPageHelp,
            cardId: 'unitsPage',
          }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Default Muster Requirements" />
              <CardContent>
                <MusterConfigReadable
                  className={classes.musterConfiguration}
                  empty="Units are not required to muster."
                  reports={reports}
                  musterConfiguration={defaultMusterConfiguration}
                />
                <CardActions>
                  <Button
                    size="large"
                    onClick={showDefaultMusterConfig}
                  >
                    Configure
                  </Button>
                  {defaultMusterSaved && (
                    <Typography variant="subtitle1" className={classes.defaultMusterSaved}>
                      <CheckCircleIcon /> Changes saved successfully!
                    </Typography>
                  )}
                </CardActions>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title="Units" />
              <CardActions>
                <Button
                  size="large"
                  variant="text"
                  color="primary"
                  onClick={newUnit}
                  startIcon={<AddCircleIcon />}
                >
                  Add New Unit
                </Button>
              </CardActions>
              <CardContent>
                <TableContainer className={classes.table}>
                  <Table aria-label="unit table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Muster Requirements</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {units.map(unit => (
                        <TableRow key={unit.id}>
                          <TableCell>{unit.name}</TableCell>
                          <TableCell className={classes.musterConfiguration}>
                            {unit.musterConfiguration.length ? musterConfigurationsToStrings(unit.musterConfiguration, reports)
                              .map((muster, index) => (
                                <div key={JSON.stringify({ muster, index })}>
                                  {muster}
                                </div>
                              )) : null}

                            {unit.includeDefaultConfig && (
                              <span className={classes.subtle}>Using default muster requirements.</span>
                            )}

                            {!unit.includeDefaultConfig && !unit.musterConfiguration.length && (
                              <span className={classes.subtle}>None</span>
                            )}
                          </TableCell>
                          <TableCell className={classes.iconCell}>
                            <IconButton
                              aria-label="unit actions"
                              aria-controls={`unit-${unit.id}-menu`}
                              aria-haspopup="true"
                              onClick={handleUnitMenuClick(unit)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <Menu
                        id="unit-menu"
                        anchorEl={unitMenu.anchor}
                        keepMounted
                        open={Boolean(unitMenu.unit)}
                        onClose={handleUnitMenuClose}
                      >
                        <MenuItem onClick={editUnit}>Edit Unit</MenuItem>
                        <MenuItem onClick={deleteUnit}>Delete Unit</MenuItem>
                      </Menu>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {Boolean(unitToDelete) && (
        <Dialog
          open={Boolean(unitToDelete)}
          onClose={cancelDeleteUnitDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Unit</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Are you sure you want to delete the '${unitToDelete?.name}' unit?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeleteUnit}>
              Yes
            </Button>
            <Button onClick={cancelDeleteUnitDialog}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {editUnitDialogProps.open && <EditUnitDialog {...editUnitDialogProps} />}
      {defaultMusterDialogProps.open && <DefaultMusterDialog {...defaultMusterDialogProps} />}
    </main>
  );
};
