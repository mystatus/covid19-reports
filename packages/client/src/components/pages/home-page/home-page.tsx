import React, {
  useEffect,
  useState,
} from 'react';
import {
  Card,
  CardContent,
  Container,
  Grid,
  Hidden,
  Theme,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import clsx from 'clsx';
import { OrphanedRecordSelector } from '../../../selectors/orphaned-record.selector';
import { UserSelector } from '../../../selectors/user.selector';
import { Link } from '../../link/link';
import { UserActions } from '../../../slices/user.slice';
import useStyles from './home-page.styles';
import welcomeImage from '../../../media/images/welcome-image.png';
import PageHeader from '../../page-header/page-header';
import { ApiAccessRequest } from '../../../models/api-response';
import { formatErrorMessage } from '../../../utility/errors';
import { Modal } from '../../../actions/modal.actions';
import { AccessRequestClient } from '../../../client/access-request.client';
import { MusterClient } from '../../../client/muster.client';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { AppFrameActions } from '../../../slices/app-frame.slice';
import { OrphanedRecordActions } from '../../../slices/orphaned-record.slice';

const HomePageHelp = () => {
  const user = useAppSelector(state => state.user);

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
                Track your group&apos;s daily muster compliance, view daily trends, as well as
                export data.
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
  const dispatch = useAppDispatch();
  const orgId = useAppSelector(UserSelector.orgId)!;
  const orphanedRecords = useAppSelector(OrphanedRecordSelector.root);
  const user = useAppSelector(state => state.user);

  const [accessRequests, setAccessRequests] = useState<ApiAccessRequest[]>([]);
  const [musterComplianceLastTwoWeeks, setMusterComplianceLastTwoWeek] = useState<number[]>([-1.0, -1.0]);

  useEffect(() => {
    dispatch(AppFrameActions.setPageLoading({ isLoading: true }));
    void dispatch(UserActions.refresh());
  }, [dispatch, orgId]);

  useEffect(() => {
    void (async () => {
      if (user.activeRole?.role.canManageRoster) {
        try {
          await dispatch(OrphanedRecordActions.fetchCount({ orgId: orgId! }));
        } catch (error) {
          void dispatch(Modal.alert('Get Orphaned Records', formatErrorMessage(error, 'Failed to get orphaned records')));
        }
      }
      dispatch(AppFrameActions.setPageLoading({ isLoading: false }));
    })();
  }, [dispatch, user, orgId]);

  const initializeTable = React.useCallback(async () => {
    if (orgId) {
      try {
        if (user.activeRole?.role.canManageGroup) {
          const requests = await AccessRequestClient.getAccessRequests(orgId!);
          setAccessRequests(requests);
        }
        if (user.activeRole?.role.canViewMuster) {
          const { weekly } = await MusterClient.getWeeklyMusterTrends(orgId!, {
            weeksCount: '2',
          });

          if (weekly.length === 2) {
            const week1Compliance = weekly[0].total > 0 ? weekly[0].onTime / weekly[0].total : -1;
            const week2Compliance = weekly[1].total > 0 ? weekly[1].onTime / weekly[1].total : -1;
            setMusterComplianceLastTwoWeek([week1Compliance * 100, week2Compliance * 100]);
          }
        }
      } catch (_) {
        // Error handling? This should probably just retry?
      }
    }
  }, [user, orgId]);

  useEffect(() => {
    void initializeTable();
  }, [initializeTable]);


  const noMusterData = musterComplianceLastTwoWeeks[1] < 0;
  const complianceDelta = musterComplianceLastTwoWeeks[0] < 0 ? 0 : musterComplianceLastTwoWeeks[1] - musterComplianceLastTwoWeeks[0];
  const trendingUp = complianceDelta > 0;
  const trendingDown = complianceDelta < 0;

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
                    {noMusterData ? '----' : `${Math.round(musterComplianceLastTwoWeeks[1])}%`}
                  </Typography>
                  {!noMusterData ? (
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
                  ) : (
                    <Typography className={classes.metricTrending}>
                      <span className={classes.metricTrendingIcon}>
                        <ArrowUpwardIcon />
                      </span>
                      <Hidden smDown>
                        <span className={classes.subtle}>No observations last 7 days</span>
                      </Hidden>
                    </Typography>
                  )}
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
                    {orphanedRecords.count}
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
        </Grid>
      </Container>
    </main>
  );
};
