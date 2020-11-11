import React, { useEffect, useState } from 'react';
import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { useDispatch, useSelector } from 'react-redux';
import { ApiRole, ApiRosterColumnInfo } from '../../models/api-response';
import useStyles from './role-info-panel.styles';
import { parsePermissions } from '../../utility/permission-set';
import { Notification } from '../../actions/notification.actions';
import { Roster } from '../../actions/roster.actions';
import { RosterSelector } from '../../selectors/roster.selector';
import { NotificationSelector } from '../../selectors/notification.selector';
import { UserSelector } from '../../selectors/user.selector';

export type RoleInfoPanelProps = {
  role?: ApiRole
};

const RoleInfoPanel: React.FunctionComponent<RoleInfoPanelProps> = ({ role }: RoleInfoPanelProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orgId = useSelector(UserSelector.orgId);
  const availableNotifications = useSelector(NotificationSelector.all);
  const rosterColumns = useSelector(RosterSelector.columns);

  const initializeTable = React.useCallback(async () => {
    if (orgId) {
      dispatch(Notification.fetch(orgId));
      dispatch(Roster.fetchColumns(orgId));
    }
  }, [dispatch, orgId]);

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  if (!role) {
    return null;
  }

  const permissions = parsePermissions(rosterColumns, role.allowedRosterColumns);

  const buildNotificationEventRows = () => {
    return availableNotifications.map(notification => (
      <TableRow key={notification.id}>
        <TableCell className={classes.textCell}>
          {notification.name}
        </TableCell>
        <TableCell className={classes.iconCell}>
          {role.allowedNotificationEvents.some(event => event === '*' || event === notification.id) && <CheckIcon />}
        </TableCell>
      </TableRow>
    ));
  };

  const columnAllowed = (column: ApiRosterColumnInfo) => {
    return permissions[column.name]
      && (!column.pii || role.canViewPII || role.canViewPHI)
      && (!column.phi || role.canViewPHI);
  };

  const buildRosterColumnRows = () => {
    return rosterColumns
      .filter(column => column.name !== 'lastReported')
      .map(column => (
        <TableRow key={column.name}>
          <TableCell className={classes.textCell}>
            {column.displayName}
          </TableCell>
          <TableCell className={classes.iconCell}>
            {columnAllowed(column) && <CheckIcon />}
          </TableCell>
        </TableRow>
      ));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Typography className={classes.roleHeader}>Description:</Typography>
        <Typography>{role.description}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography className={classes.roleHeader}>Allowed Notifications:</Typography>
        <Table aria-label="Notifications" className={classes.roleTable}>
          <TableBody>
            {buildNotificationEventRows()}
          </TableBody>
        </Table>
      </Grid>
      <Grid item xs={6}>
        <Typography className={classes.roleHeader}>Viewable Roster Columns:</Typography>
        <Table aria-label="Roster Columns" className={classes.roleTable}>
          <TableBody>
            {buildRosterColumnRows()}
          </TableBody>
        </Table>
      </Grid>
      <Grid item xs={6}>
        <Typography className={classes.roleHeader}>Permissions:</Typography>
        <Table aria-label="Permissions" className={classes.roleTable}>
          <TableBody>
            <TableRow>
              <TableCell className={classes.textCell}>Manage Group</TableCell>
              <TableCell className={classes.iconCell}>
                {role.canManageGroup && <CheckIcon />}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.textCell}>Manage Roster</TableCell>
              <TableCell className={classes.iconCell}>
                {role.canManageRoster && <CheckIcon />}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.textCell}>Manage Workspace</TableCell>
              <TableCell className={classes.iconCell}>
                {role.canManageWorkspace && <CheckIcon />}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.textCell}>View Roster</TableCell>
              <TableCell className={classes.iconCell}>
                {role.canViewRoster && <CheckIcon />}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.textCell}>View Muster Reports</TableCell>
              <TableCell className={classes.iconCell}>
                {role.canViewMuster && <CheckIcon />}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.textCell}>View PII</TableCell>
              <TableCell className={classes.iconCell}>
                {role.canViewPII && <CheckIcon />}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.textCell}>View PHI</TableCell>
              <TableCell className={classes.iconCell}>
                {role.canViewPHI && <CheckIcon />}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};
export default RoleInfoPanel;
