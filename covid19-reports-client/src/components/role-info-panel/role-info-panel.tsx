import React, { useEffect } from 'react';
import {
  Box,
  Typography,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { useDispatch, useSelector } from 'react-redux';
import { ApiRole, ApiRosterColumnInfo } from '../../models/api-response';
import useStyles, { ScrollHeightParam } from './role-info-panel.styles';
import { parsePermissions } from '../../utility/permission-set';
import { Notification } from '../../actions/notification.actions';
import { Roster } from '../../actions/roster.actions';
import { RosterSelector } from '../../selectors/roster.selector';
import { NotificationSelector } from '../../selectors/notification.selector';
import { UserSelector } from '../../selectors/user.selector';
import { RoleDataTable } from './role-table';

const Header = ({ text }: { text: string }) => <Typography className={useStyles().roleHeader}>{text}:</Typography>;

type SectionProps = ScrollHeightParam & {
  children?: React.ReactChild
  title: string
  visible?: boolean
};

const Section = ({
  children, scrollHeight, title, visible,
}: SectionProps) => {
  const { sectionBody } = useStyles({ scrollHeight });

  if (visible === false) {
    return null;
  }
  return (
    <>
      <Header text={title} />
      <div className={sectionBody}>
        {children}
      </div>
    </>
  );
};

type TextSectionProps = Exclude<SectionProps, 'children'> & {
  text?: string
};

const TextSection = ({ text, ...rest }: TextSectionProps) => (
  <Section {...rest}>
    <Typography>{text}</Typography>
  </Section>
);

export type RoleInfoPanelProps = {
  role?: ApiRole
  scrollFix?: boolean
};

const RoleInfoPanel = (props: RoleInfoPanelProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orgId = useSelector(UserSelector.orgId);
  const availableNotifications = useSelector(NotificationSelector.all);
  const rosterColumns = useSelector(RosterSelector.columns);
  const { role } = props;

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

  const columnAllowed = (column: ApiRosterColumnInfo) => {
    return permissions[column.name]
      && (!column.pii || role.canViewPII || role.canViewPHI)
      && (!column.phi || role.canViewPHI);
  };

  return (
    <Box display="flex" width="100%">
      <Box flex={1}>
        <Box className={classes.section}>
          <TextSection
            text={role.workspaces.map(x => x.name).join(', ') || 'None'}
            title="Spaces"
          />
        </Box>

        <Box className={classes.section}>
          <Section title="Permissions">
            <RoleDataTable
              aria-label="Permissions"
              data={[
                { label: 'Manage Group', value: role.canManageGroup },
                { label: 'Manage Roster', value: role.canManageRoster },
                { label: 'Manage Workspace', value: role.canManageWorkspace },
                { label: 'View Roster', value: role.canViewRoster },
                { label: 'View Muster Reports', value: role.canViewMuster },
                { label: 'View PII', value: role.canViewPII },
                { label: 'View PHI', value: role.canViewPHI },
              ]}
              extractLabel="label"
              extractValue={({ value }) => value && <CheckIcon />}
            />
          </Section>
        </Box>
      </Box>

      <Box flex={1}>
        <Box className={classes.section}>
          <Section title="Allowed Notifications">
            <RoleDataTable
              aria-label="Notifications"
              data={availableNotifications}
              extractLabel="name"
              extractValue={notification => role.allowedNotificationEvents.some(event => event === '*' || event === notification.id) && <CheckIcon />}
            />
          </Section>
        </Box>

        <Box className={classes.section}>
          <Section title="Viewable Roster Columns">
            <RoleDataTable
              aria-label="Roster Columns"
              data={rosterColumns}
              extractLabel="displayName"
              extractValue={column => columnAllowed(column) && <CheckIcon />}
            />
          </Section>
        </Box>
      </Box>
    </Box>
  );
};
export default RoleInfoPanel;
