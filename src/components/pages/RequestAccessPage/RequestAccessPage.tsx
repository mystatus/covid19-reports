import {
  Button,
  Card, CardActionArea, CardContent, Container, Paper, Snackbar, Table, TableBody, TableCell, TableContainer,
  TableFooter, TableHead,
  TablePagination,
  TableRow, Toolbar, Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { UserData } from '../../../actions/userActions';
import useStyles from './RequestAccess.styles';

interface Group {
  name: string
  contact: UserData
}

export const RequestAccessPage = () => {
  const classes = useStyles();
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [isInfoCardVisible, setIsInfoCardVisible] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);

  async function fetchGroups() {
    const response = await axios.get('api/org') as AxiosResponse<Group[]>;
    setGroups(response.data);
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <>
      <Container maxWidth="md">
        <h1>My Groups</h1>

        {isInfoCardVisible && (
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
                  Use the “request access” button to send an access request to the group’s admin.
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

        <Paper>
          <Toolbar>
            <Typography variant="h6" id="tableTitle" component="div">
              All Groups
            </Typography>
          </Toolbar>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Group Name</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map(group => (
                  <TableRow key={group.name}>
                    <TableCell component="th" scope="row">
                      {group.name}
                    </TableCell>
                    <TableCell>{`${group.contact.first_name} ${group.contact.last_name}`}</TableCell>
                    <TableCell>{group.contact.email}</TableCell>
                    <TableCell>{group.contact.phone}</TableCell>
                    <TableCell>Request Access</TableCell>
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
