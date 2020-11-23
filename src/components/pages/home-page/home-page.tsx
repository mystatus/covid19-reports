import React from 'react';
import { useSelector } from 'react-redux';
import {
  Button, Card, CardActions, CardContent, Container, Grid, Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import useStyles from './home-page.styles';
import welcomeImage from '../../../media/images/welcome-image.png';

export const HomePage = () => {
  const user = useSelector<AppState, UserState>(state => state.user);
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* Welcome */}
            <Card className={classes.card}>
              <CardContent>
                <Grid container direction="row">
                  <Grid item xs={8}>
                    <Typography variant="h5" gutterBottom>
                      Welcome to Status Engine!
                    </Typography>

                    <Typography gutterBottom>
                      With Status Engine you can easily monitor COVID-19 cases across your entire organization. If you have any questions, comments or concerns please reach out to us by email at <a href="mailto:covid19feedback@dds.mil">covid19feedback@dds.mil</a>.
                    </Typography>

                    <ul>
                      {user.activeRole?.canViewRoster && (
                        <li>
                          <Typography>
                            <strong><Link to="/roster">Roster Management</Link><br /></strong> Manage your organization’s roster with the built-in suite of tools designed to allow for quick and easy modifications.
                          </Typography>
                        </li>
                      )}
                      {user.activeRole?.canViewMuster && (
                        <li>
                          <Typography>
                            <strong><Link to="/muster">Muster Snapshot</Link><br /></strong> Track your group's daily muster compliance, view weekly and monthly trends, as well as export data.
                          </Typography>
                        </li>
                      )}
                      {user.activeRole?.workspace && (
                        <li>
                          <Typography>
                            <strong><Link to={`/dashboard?orgId=${user.activeRole?.org?.id}`}>Customizeable Dashboards</Link><br /></strong>  Protect sensitive data by creating and assigning role-based permissions across the entire organization.
                          </Typography>
                        </li>
                      )}
                      <li>
                        <Typography>
                          <strong><Link to="/settings">Alerts &amp; Notifications</Link><br /></strong> Stay up-to-date on organization activity without overburdening your inbox or mobile device with fully customizeable alerts.
                        </Typography>
                      </li>
                    </ul>
                  </Grid>

                  <Grid item xs={4}>
                    <img src={welcomeImage} height="300" alt="Welcome" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};
