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
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import moment from 'moment-timezone';
import axios from 'axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { UnitsPageHelp } from './units-page-help';
import useStyles from './units-page.styles';
import { ApiUnit, MusterConfiguration } from '../../../models/api-response';
import { EditUnitDialog, EditUnitDialogProps } from './edit-unit-dialog';
import { UnitSelector } from '../../../selectors/unit.selector';
import { Unit } from '../../../actions/unit.actions';
import PageHeader from '../../page-header/page-header';
import { daysToString } from '../../../utility/days';
import { Modal } from '../../../actions/modal.actions';
import { formatMessage } from '../../../utility/errors';
import { DefaultMusterDialog, DefaultMusterDialogProps } from './default-muster-dialog';
import { User } from '../../../actions/user.actions';
import { UserSelector } from '../../../selectors/user.selector';

interface UnitMenuState {
  anchor: HTMLElement | null,
  unit?: ApiUnit,
}

export const UnitsPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const units = useSelector(UnitSelector.all);
  const [unitToDelete, setUnitToDelete] = useState<null | ApiUnit>(null);
  const [editUnitDialogProps, setEditUnitDialogProps] = useState<EditUnitDialogProps>({ open: false });
  const [defaultMusterDialogProps, setDefaultMusterDialogProps] = useState<DefaultMusterDialogProps>({ open: false });
  const [unitMenu, setUnitMenu] = React.useState<UnitMenuState>({ anchor: null });
  const [defaultMusterSaved, setDefaultMusterSaved] = React.useState(false);

  const org = useSelector(UserSelector.org);
  const orgId = org?.id;
  const defaultMusterConfiguration = org?.defaultMusterConfiguration ?? [];

  const initializeTable = React.useCallback(async () => {
    if (orgId) {
      await dispatch(Unit.fetch(orgId));
    }
  }, [orgId, dispatch]);

  const showDefaultMusterConfig = async () => {
    setDefaultMusterDialogProps({
      open: true,
      onClose: async (success?: boolean) => {
        setDefaultMusterDialogProps({ open: false });
        if (success) {
          await dispatch(User.login());
          await initializeTable();
          setDefaultMusterSaved(true);
        }
      },
      onError: (message: string) => {
        dispatch(Modal.alert('Default Muster Configuration', `Unable edit the default muster configuration: ${message}`));
      },
    });
  };

  const newUnit = async () => {
    setEditUnitDialogProps({
      open: true,
      orgId,
      onClose: async () => {
        setEditUnitDialogProps({ open: false });
        await initializeTable();
      },
      onError: (message: string) => {
        dispatch(Modal.alert('Add Unit', `Unable to add unit: ${message}`));
      },
    });
  };

  const editUnit = () => {
    if (unitMenu.unit) {
      setUnitMenu({ anchor: null });
      setEditUnitDialogProps({
        open: true,
        unit: unitMenu.unit,
        orgId,
        onClose: async () => {
          setEditUnitDialogProps({ open: false });
          await initializeTable();
        },
        onError: (message: string) => {
          dispatch(Modal.alert('Edit Unit', `Unable to edit unit: ${message}`));
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
      await axios.delete(`api/unit/${orgId}/${unitToDelete.id}`);
    } catch (error) {
      dispatch(Modal.alert('Delete Unit', formatMessage(error, 'Unable to delete unit')));
    }
    setUnitToDelete(null);
    await initializeTable();
  };

  const musterConfigurationToString = (muster: MusterConfiguration) => {
    const today = moment().format('Y-M-D');
    const time = moment.tz(`${today} ${muster.startTime}`, 'Y-M-D h:mm', muster.timezone).format('h:mm A z');
    const duration = muster.durationMinutes / 60;
    return `${daysToString(muster.days)} at ${time} for ${duration} hours`;
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

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

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
        <Card>
          <CardHeader title="Default Muster Requirements" />
          <CardContent>
            <div className={classes.musterConfiguration}>
              {defaultMusterConfiguration.map((muster, index) => (
                <div key={JSON.stringify({ muster, index })}>
                  {musterConfigurationToString(muster)}
                </div>
              ))}
            </div>
            {!defaultMusterConfiguration?.length && <span>No default requirements found.</span>}
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
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Muster Requirements</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {units.map(unit => (
                    <TableRow key={unit.id}>
                      <TableCell>{unit.id}</TableCell>
                      <TableCell>{unit.name}</TableCell>
                      {unit.musterConfiguration?.length > 0 && (
                        <TableCell className={classes.musterConfiguration}>
                          {unit.musterConfiguration.map((muster, index) => (
                            <div key={JSON.stringify({ muster, index })}>
                              {musterConfigurationToString(muster)}
                            </div>
                          ))}
                        </TableCell>
                      )}
                      {!unit.musterConfiguration?.length && (
                        <TableCell className={classes.noMusterConfiguration}>
                          {(defaultMusterConfiguration?.length !== 0 && unit.musterConfiguration === null) ? (
                            <span>* Using default muster requirements</span>
                          ) : (
                            <span>No configured muster requirements</span>
                          )}
                        </TableCell>
                      )}
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
