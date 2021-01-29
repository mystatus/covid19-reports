import React, { useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
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
import NegativeMarginScrollFix from './negative-margin-scroll-fix';

const Header = ({ text }: { text: string }) => <Typography className={useStyles().roleHeader}>{text}:</Typography>;

type SectionProps = ScrollHeightParam & {
  children?: React.ReactChild
  full?: boolean
  title: string
  visible?: boolean
};

const Section = ({
  children, full, scrollHeight, title, visible,
}: SectionProps) => {
  const { sectionBody } = useStyles({ scrollHeight });

  if (visible === false) {
    return null;
  }
  return (
    <Grid item xs={full ? 12 : 6}>
      <Header text={title} />
      <div className={sectionBody}>
        {children}
      </div>
    </Grid>
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
  hideUnitFilter?: boolean
  hideWorkspaceDescription?: boolean
  hideWorkspaceName?: boolean
  role?: ApiRole
  scrollFix?: boolean
};

const RoleInfoPanel = (props: RoleInfoPanelProps) => {
  const dispatch = useDispatch();
  const orgId = useSelector(UserSelector.orgId);
  const availableNotifications = useSelector(NotificationSelector.all);
  const rosterColumns = useSelector(RosterSelector.columns);
  const {
    hideUnitFilter = false,
    hideWorkspaceDescription = false,
    hideWorkspaceName = false,
    role,
    scrollFix,
  } = props;

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

  const gridSpacing = 3;
  const permissions = parsePermissions(rosterColumns, role.allowedRosterColumns);

  const columnAllowed = (column: ApiRosterColumnInfo) => {
    return permissions[column.name]
      && (!column.pii || role.canViewPII || role.canViewPHI)
      && (!column.phi || role.canViewPHI);
  };

  return (
    <NegativeMarginScrollFix spacing={scrollFix ? gridSpacing : 0}>
      <Grid container spacing={gridSpacing}>
        <TextSection full={hideUnitFilter} text={role.description} title="Description" />
        <TextSection text={role.defaultIndexPrefix} title="Default Unit Filter" visible={!hideUnitFilter} />
        <Grid item container xs={6}>
          <TextSection
            full
            text={role.workspace?.name ?? 'None'}
            title="Analytics Workspace"
            visible={!hideWorkspaceName}
          />
          <TextSection
            full
            scrollHeight="tall"
            text={role.workspace ? role.workspace.description || 'None' : 'No workspace, users with this role will not have access to analytics dashboards.'}
            title="Workspace Description"
            visible={!hideWorkspaceDescription}
          />
        </Grid>
        <Section title="Allowed Notifications">
          <RoleDataTable
            aria-label="Notifications"
            data={availableNotifications}
            extractLabel="name"
            extractValue={notification => role.allowedNotificationEvents.some(event => event === '*' || event === notification.id) && <CheckIcon />}
          />
        </Section>
        <Section title="Viewable Roster Columns">
          <RoleDataTable
            aria-label="Roster Columns"
            data={rosterColumns}
            extractLabel="displayName"
            extractValue={column => columnAllowed(column) && <CheckIcon />}
          />
        </Section>
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
      </Grid>
    </NegativeMarginScrollFix>
  );
};
export default RoleInfoPanel;
