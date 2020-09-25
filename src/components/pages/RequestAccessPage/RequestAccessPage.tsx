import {
  Button, Card, CardContent, Chip, Container, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Toolbar, Tooltip, Typography,
} from '@material-ui/core';
import { MailOutline, PersonAdd } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { UserData } from '../../../actions/userActions';
import useStyles from './RequestAccess.styles';

interface Org {
  id: number
  name: string
  contact: UserData
}

interface AccessRequest {
  id: number
  org: Org
  request_date: Date
  status: string
}

export const RequestAccessPage = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [isInfoCardVisible, setIsInfoCardVisible] = useState(true);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);

  async function fetchOrgs() {
    const response = await axios.get('api/org') as AxiosResponse<Org[]>;
    setOrgs(response.data);
  }

  async function fetchAccessRequests() {
    const response = await axios.get('api/user/access-requests') as AxiosResponse<AccessRequest[]>;
    console.log('accessRequests', response.data);
    setAccessRequests(response.data);
  }

  function handleEmailClick(org: Org) {
    copyToClipboard(org.contact.email);
  }

  function handleRequestAccess(org: Org) {
    async function requestAccess() {
      const response = await axios.post(`api/access-request/${org.id}`) as AxiosResponse<AccessRequest>;
      setAccessRequests([
        ...accessRequests,
        response.data,
      ]);
    }

    requestAccess();
  }

  function copyToClipboard(text: string) {
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.setAttribute('value', text);
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  }

  useEffect(() => {
    async function fetchData() {
      await Promise.all([
        fetchOrgs(),
        fetchAccessRequests(),
      ]);

      setIsLoading(false);
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <Container maxWidth="md">
        <h1>My Groups</h1>

        {/* Requests */}
        {accessRequests.length > 0 && (
          <Paper className={classes.paper}>
            <TableContainer>
              <Table size="small" aria-label="access requests table">
                <TableHead>
                  <TableRow>
                    <TableCell>Group Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell style={{ paddingLeft: '28px' }}>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accessRequests.map(req => (
                    <TableRow key={req.org.name}>
                      <TableCell component="th" scope="row">
                        {req.org.name}
                      </TableCell>
                      <TableCell>{`${req.org.contact.first_name} ${req.org.contact.last_name}`}</TableCell>
                      <TableCell>
                        <Tooltip title="Copy to clipboard" aria-label="copy email to clipboard">
                          <IconButton onClick={() => handleEmailClick(req.org)} aria-label="email">
                            <MailOutline />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{req.org.contact.phone}</TableCell>
                      <TableCell>
                        <Chip
                          label={req.status}
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {accessRequests.length === 0 && isInfoCardVisible && (
          <Card className={classes.infoCard} variant="outlined">
            <CardContent className={classes.infoCardContent}>
              <header>
                <div>You are not a member of any groups.</div>
                <p>
                  In order to use StatusEngine and view data, you must first belong to a group. Joining a group is easy.
                  Simply follow the these three steps and you’ll be on your way in no time!
                </p>
              </header>

              <ol>
                <li>
                  Find your group(s) using the table below.
                </li>
                <li>
                  Use the “request access” button to send an access request to the group’s contact.
                </li>
                <li>
                  Keep track of your access requests, status and joined groups via this screen.
                </li>
              </ol>

              <Button size="large" onClick={() => setIsInfoCardVisible(false)}>
                Ok, I got it
              </Button>
            </CardContent>
          </Card>
        )}

        {/* All Groups */}
        <Paper className={classes.paper}>
          <Toolbar>
            <Typography variant="h6" id="tableTitle" component="div">
              All Groups
            </Typography>
          </Toolbar>
          <TableContainer>
            <Table size="small" aria-label="all groups table">
              <TableHead>
                <TableRow>
                  <TableCell>Group Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell style={{ paddingLeft: '28px' }}>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orgs.map(org => (
                  <TableRow key={org.name}>
                    <TableCell component="th" scope="row">
                      {org.name}
                    </TableCell>
                    <TableCell>{`${org.contact.first_name} ${org.contact.last_name}`}</TableCell>
                    <TableCell>
                      <Tooltip title="Copy to clipboard" aria-label="copy email to clipboard">
                        <IconButton onClick={() => handleEmailClick(org)} aria-label="email">
                          <MailOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{org.contact.phone}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        startIcon={<PersonAdd />}
                        onClick={() => handleRequestAccess(org)}
                      >
                        Request Access
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Snackbar
        open={isAlertVisible}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setIsAlertVisible(false)}
      >
        <Alert onClose={() => setIsAlertVisible(false)} severity="success" variant="filled">
          You have successfully registered and logged in!
        </Alert>
      </Snackbar>
    </>
  );
};
