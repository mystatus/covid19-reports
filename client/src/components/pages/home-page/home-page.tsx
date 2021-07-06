import React, { useEffect, useState } from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { Box,
  Card,
  CardContent,
  Container,
  Grid,
  Hidden,
  Theme,
  Tooltip,
  Typography,
  withStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import FavoriteIcon from '@material-ui/icons/Favorite';
import clsx from 'clsx';
import axios from 'axios';
import moment from 'moment';
import { UserSelector } from '../../../selectors/user.selector';
import { WorkspaceSelector } from '../../../selectors/workspace.selector';
import { Link } from '../../link/link';
import { User } from '../../../actions/user.actions';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import useStyles from './home-page.styles';
import welcomeImage from '../../../media/images/welcome-image.png';
import PageHeader from '../../page-header/page-header';
import { OrphanedRecordSelector } from '../../../selectors/orphaned-record.selector';
import { AccessRequestClient } from '../../../client';
import { ApiAccessRequest, ApiDashboard, ApiMusterTrends, ApiWorkspace } from '../../../models/api-response';
import { AppFrame } from '../../../actions/app-frame.actions';
import { Workspace } from '../../../actions/workspace.actions';
import { getDashboardUrl } from '../../../utility/url-utils';


const HomePageHelp = () => {
  const user = useSelector<AppState, UserState>(state => state.user);

  return (
    <Grid container direction="row">
      <Grid item xs={8}>
        <Typography variant="h5" gutterBottom>
          Welcome to Status Engine!
        </Typography>

        <Typography gutterBottom>
          With Status Engine you can easily monitor COVID-19 cases across your entire organization. If you
          have any questions, comments or concerns please reach out to us by email at&nbsp;
          <Link href="mailto:covid19feedback@dds.mil" target="_blank">covid19feedback@dds.mil</Link>.
        </Typography>

        <ul>
          {user.activeRole?.role.canViewRoster && (
            <li>
              <Typography>
                <strong><Link to="/roster">Roster Management</Link></strong><br />
                Manage your organization&apos;s roster with the built-in suite of tools designed to allow for
                quick and easy modifications.
              </Typography>
            </li>
          )}
          {user.activeRole?.role.canViewMuster && (
            <li>
              <Typography>
                <strong><Link to="/muster">Muster Snapshot</Link></strong><br />
                Track your group&apos;s daily muster compliance, view weekly and monthly trends, as well as
                export data.
              </Typography>
            </li>
          )}
          {user.activeRole?.role.workspaces && (
            <li>
              <Typography>
                <strong><Link to="/spaces">Customizable Dashboards</Link></strong><br />
                Protect sensitive data by creating and assigning role-based permissions across the entire
                organization.
              </Typography>
            </li>
          )}
          <li>
            <Typography>
              <strong><Link to="/settings">Alerts &amp; Notifications</Link></strong><br />
              Stay up-to-date on organization activity without overburdening your inbox or mobile device
              with fully customizable alerts.
            </Typography>
          </li>
        </ul>
      </Grid>

      <Grid item xs={4}>
        <img src={welcomeImage} height="300" alt="Welcome" />
      </Grid>
    </Grid>
  );
};

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    padding: theme.spacing(1),
    border: '1px solid #dadde9',
  },
}))(Tooltip);


export const HomePage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orgId = useSelector(UserSelector.orgId)!;
  const user = useSelector<AppState, UserState>(state => state.user);
  const orphanedRecords = useSelector(OrphanedRecordSelector.root);
  const [accessRequests, setAccessRequests] = useState<ApiAccessRequest[]>([]);
  const [musterComplianceLastTwoWeeks, setMusterComplianceLastTwoWeek] = useState<number[]>([1.0, 0.0]);
  const favoriteDashboards = useSelector(UserSelector.favoriteDashboards)!;
  const workspaces = useSelector(UserSelector.workspaces)!;
  const dashboards = useSelector(WorkspaceSelector.dashboards)!;

  useEffect(() => {
    dispatch(AppFrame.setPageLoading(true));
    dispatch(User.refresh());
    dispatch(Workspace.fetch(orgId));
  }, [dispatch, orgId]);

  useEffect(() => {
    (async () => {
      for (const workspace of workspaces) {
        await dispatch(Workspace.fetchDashboards(orgId, workspace.id));
      }

      dispatch(AppFrame.setPageLoading(false));
    })();
  }, [dispatch, orgId, workspaces]);

  const isDashboardFavorited = (workspace: ApiWorkspace, dashboard: ApiDashboard) => {
    if (favoriteDashboards[workspace.id]) {
      return Boolean(favoriteDashboards[workspace.id][dashboard.uuid]);
    }
    return false;
  };

  const initializeTable = React.useCallback(async () => {
    if (orgId) {
      try {
        const requestsPromise = AccessRequestClient.fetchAll(orgId!);
        const { weekly } = (await axios.get(`api/muster/${orgId}/unit-trends`, {
          params: {
            currentDate: moment().toISOString(),
            weeksCount: 2,
            monthsCount: 0,
          },
        })).data as ApiMusterTrends;

        // Sum up muster percent for each of the last two weeks
        const weeklyAverages = Object.keys(weekly).sort().map(date => {
          const units = Object.keys(weekly[date]);
          let sum = 0;
          for (const unitName of units) {
            sum += weekly[date][unitName].musterPercent;
          }
          return units.length ? sum / units.length : 0;
        });

        const twoWeeksOfAverages = [0, 0, ...weeklyAverages].slice(-2);

        const requests = await requestsPromise;
        setMusterComplianceLastTwoWeek(twoWeeksOfAverages);
        setAccessRequests(requests);
      } catch (_) {
        // Error handling? This should probably just retry?
      }
    }
  }, [orgId]);

  useEffect(() => {
    initializeTable().then();
  }, [initializeTable]);

  const complianceDelta = musterComplianceLastTwoWeeks[1] - musterComplianceLastTwoWeeks[0];
  const trendingUp = complianceDelta > 0;
  const trendingDown = complianceDelta < 0;

  const workspacesWithFavorites = workspaces
    .filter(workspace => (dashboards[workspace.id] ?? []).some(dashboard => isDashboardFavorited(workspace, dashboard)));

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <PageHeader
          title={`Welcome back, ${user.firstName}!`}
          help={{
            contentComponent: HomePageHelp,
            cardId: 'homePage',
            variant: 'plain',
          }}
        />

        <Grid container spacing={3}>
          {user.activeRole?.role.canViewMuster && (
            <Grid item xs={4}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.metricLabel}>
                    Muster Compliance
                    <HtmlTooltip
                      arrow
                      placement="top"
                      title="The average muster rate for individuals within the group over the 7 days."
                    >
                      <InfoOutlinedIcon />
                    </HtmlTooltip>
                  </Typography>
                  <Typography className={classes.metricValue}>
                    {Math.round(musterComplianceLastTwoWeeks[1])}%
                  </Typography>
                  <Typography className={clsx(classes.metricTrending, {
                    [classes.metricUp]: trendingUp,
                    [classes.metricDown]: trendingDown,
                  })}
                  >
                    <span className={classes.metricTrendingIcon}>
                      <ArrowUpwardIcon />
                    </span>
                    {(complianceDelta).toFixed(2)}%
                    <Hidden smDown>
                      <span className={classes.subtle}>last 7 days</span>
                    </Hidden>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          {user.activeRole?.role.canManageRoster && (
            <Grid item xs={4}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.metricLabel}>
                    Orphaned Records
                  </Typography>
                  <Typography className={classes.metricValue}>
                    {orphanedRecords.totalRowsCount}
                  </Typography>
                  <Link to="/roster">View Now &rarr;</Link>
                </CardContent>
              </Card>
            </Grid>
          )}
          {user.activeRole?.role.canManageGroup && (
            <Grid item xs={4}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.metricLabel}>
                    User Access Requests
                  </Typography>
                  <Typography className={classes.metricValue}>
                    {accessRequests.length}
                  </Typography>
                  <Link to="/users">View Now &rarr;</Link>
                </CardContent>
              </Card>
            </Grid>
          )}
          {user.activeRole?.role.workspaces && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" className={classes.favoritesContainer}>
                  <FavoriteIcon color="secondary" />
                  <Typography variant="subtitle1">
                    My Favorited Dashboards
                  </Typography>
                </Box>
                <Link to="/spaces">View All Dashboards</Link>
              </Box>
              {workspacesWithFavorites
                .map(workspace => (
                  <Card key={workspace.id} className={classes.favoritesCard}>
                    <Box fontSize="1rem" fontWeight={500}>
                      {workspace.name}
                    </Box>
                    {dashboards[workspace.id].filter(dashboard => isDashboardFavorited(workspace, dashboard)).map(dashboard => (
                      <Grid container key={dashboard.uuid}>
                        <Grid item xs={3}>
                          <Link href={getDashboardUrl(orgId, workspace.id, dashboard.uuid)}>
                            {dashboard.title}
                          </Link>
                        </Grid>
                        <Grid item xs={9} className={classes.subtle}>
                          {dashboard.description}
                        </Grid>
                      </Grid>
                    ))}
                  </Card>
                ))}
                {workspacesWithFavorites.length === 0 && (
                  <Grid item xs={12} className={classes.subtle}>
                    You have no favorite dashboards.
                  </Grid>
                )}
            </Grid>
          )}
        </Grid>
      </Container>
    </main>
  );
};
