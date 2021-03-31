import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Theme,
  Tooltip,
  Typography,
  withStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import clsx from 'clsx';
import axios from 'axios';
import { UserSelector } from '../../../selectors/user.selector';
import { Link } from '../../link/link';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import useStyles from './home-page.styles';
import welcomeImage from '../../../media/images/welcome-image.png';
import PageHeader from '../../page-header/page-header';
import { OrphanedRecordSelector } from '../../../selectors/orphaned-record.selector';
import { AccessRequestClient } from '../../../client';
import { ApiAccessRequest, ApiMusterTrends } from '../../../models/api-response';


const HomePageHelp = () => {
  const user = useSelector<AppState, UserState>(state => state.user);
  const orgId = useSelector(UserSelector.orgId);

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
                <strong><Link href={`/dashboard?orgId=${orgId}`}>Customizable Dashboards</Link></strong><br />
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
  const orgId = useSelector(UserSelector.orgId);
  const user = useSelector<AppState, UserState>(state => state.user);
  const orphanedRecords = useSelector(OrphanedRecordSelector.all);
  const [accessRequests, setAccessRequests] = useState<ApiAccessRequest[]>([]);
  const [musterNonComplianceLastTwoWeeks, setMusterNonComplianceLastTwoWeek] = useState<number[]>([1.0, 0.0]);

  const initializeTable = React.useCallback(async () => {
    if (orgId) {
      try {
        const requestsPromise = AccessRequestClient.fetchAll(orgId!);
        const { weekly } = (await axios.get(`api/muster/${orgId}/trends`, {
          params: {
            weeksCount: 2,
            monthsCount: 0,
          },
        })).data as ApiMusterTrends;

        // Sum up non-muster percent for each of the last two weeks
        const weeklyAverages = Object.keys(weekly).sort().map(date => {
          const units = Object.keys(weekly[date]);
          let sum = 0;
          for (const unitName of units) {
            sum += weekly[date][unitName].nonMusterPercent;
          }
          return units.length ? sum / units.length : 0;
        });

        const twoWeeksOfAverages = [0, 0, ...weeklyAverages].slice(-2);

        const requests = await requestsPromise;
        setMusterNonComplianceLastTwoWeek(twoWeeksOfAverages);
        setAccessRequests(requests);
      } catch (_) {
        // Error handling? This should probably just retry?
      }
    }
  }, [orgId]);

  useEffect(() => {
    initializeTable();
  }, [initializeTable]);

  const nonComplianceDelta = musterNonComplianceLastTwoWeeks[1] - musterNonComplianceLastTwoWeeks[0];
  const trendingUp = nonComplianceDelta > 0;
  const trendingDown = nonComplianceDelta < 0;

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
          <Grid item xs={4}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.metricLabel}>
                  Muster Non-Compliance
                  <HtmlTooltip
                    arrow
                    placement="top"
                    title="The average percentage of times individuals within the group did not report during muster for the last 7 days."
                  >
                    <InfoOutlinedIcon />
                  </HtmlTooltip>
                </Typography>
                <Typography className={classes.metricValue}>
                  {Math.round(musterNonComplianceLastTwoWeeks[1])}%
                </Typography>
                <Typography className={clsx(classes.metricTrending, {
                  [classes.metricUp]: trendingUp,
                  [classes.metricDown]: trendingDown,
                })}
                >
                  <span className={classes.metricTrendingIcon}>
                    <ArrowUpwardIcon />
                  </span>
                  {(nonComplianceDelta).toFixed(2)}%&nbsp;
                  {' '}<span className={classes.hint}> last 7 days</span>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.metricLabel}>
                  Orphaned Records
                </Typography>
                <Typography className={classes.metricValue}>
                  {orphanedRecords.length}
                </Typography>
                <Link to="/roster">View Now &rarr;</Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.metricLabel}>
                  User Access Requests
                </Typography>
                <Typography className={classes.metricValue}>
                  {accessRequests.length}
                </Typography>
                <Link to="/roster">View Now &rarr;</Link>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};
