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
                      With Status Engine you can easily monitor COVID-19 cases across your entire organization. If you have any questions, comments or concerns please reach out to us by email at <a href="mailto:covid19feedback@dds.mil" className={classes.colorPrimary}>covid19feedback@dds.mil</a>.
                    </Typography>

                    <ul>
                      <li className={classes.li}>
                        <Typography>
                          <strong><a href="/roster" className={classes.colorPrimary}>Roster Management</a><br /></strong> Manage your organization’s roster with the built-in suite of tools designed to allow for quick and easy modifications.
                        </Typography>
                      </li>
                      <li className={classes.li}>
                        <Typography>
                          <strong><a href="/muster" className={classes.colorPrimary}>Muster Snapshot</a><br /></strong> Track your group's daily muster compliance, view weekly and monthly trends, as well as export data.
                        </Typography>
                      </li>
                      <li className={classes.li}>
                        <Typography>
                          <strong><a href="/dashboard" className={classes.colorPrimary}>Customizeable Dashboards</a><br /></strong>  Protect sensitive data by creating and assigning role-based permissions across the entire organization.
                        </Typography>
                      </li>
                      <li className={classes.li}>
                        <Typography>
                          <strong><a href="/settings" className={classes.colorPrimary}>Alerts &amp; Notifications</a><br /></strong> Stay up-to-date on organization activity without overburdening your inbox or mobile device with fully customizeable alerts.
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

          {/* Analytics & Reporting */}

            {/* <Grid item xs={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Analytics & Reporting
                  </Typography>

                  <Typography>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odque volutpat mm malesuada erat ut
                    tupendisse nibh, viverra non, semper suscipit, posuere a, pede.
                  </Typography>
                </CardContent>

                <CardActions>
                  <a>
                    <Button>
                      View Analytics
                    </Button>
                  </a>
                </CardActions>
              </Card>
            </Grid> */}


          {/* Roster Management */}
          {/* {user.activeRole && user.activeRole.canManageRoster && (
            <Grid item xs={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Roster Management
                  </Typography>

                  <Typography>
                    Morbi in sem quis dui placerat ornare ellentesque odio nisi, euismod in, pharetra a, ultricies in,
                    diad arcuras consequ. Uguae, eu vulputate magna eroiquam erat volutptincidunt quirt.
                  </Typography>
                </CardContent>

                <CardActions>
                  <Link to="/roster">
                    <Button>
                      View Roster
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          )} */}
        </Grid>
      </Container>
    </main>
  );
};
