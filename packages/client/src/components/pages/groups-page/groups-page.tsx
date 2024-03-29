import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  MailOutline,
  PersonAdd,
  MoreVert,
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import React, {
  useEffect,
  useState,
} from 'react';
import PageHeader from '../../page-header/page-header';
import { StatusChip } from '../../status-chip/status-chip';
import useStyles from './groups-page.styles';
import {
  ApiAccessRequest,
  ApiOrg,
} from '../../../models/api-response';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { RequestAccessDialog } from './request-access-dialog';
import { AccessRequestClient } from '../../../client/access-request.client';
import { OrgClient } from '../../../client/org.client';
import { UserClient } from '../../../client/user.client';
import { AppFrameActions } from '../../../slices/app-frame.slice';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';

export const GroupsPage = () => {
  const classes = useStyles();
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const [isAlertVisible, setIsAlertVisible] = useState(!user.activeRole);
  const [isInfoCardVisible, setIsInfoCardVisible] = useState(true);
  const [accessRequests, setAccessRequests] = useState([] as ApiAccessRequest[]);
  const [accessRequestsLoading, setAccessRequestsLoading] = useState({} as ({ [orgId: number]: boolean }));
  const [allOrgs, setAllOrgs] = useState([] as ApiOrg[]);
  const [requestAccessOrgs, setRequestAccessOrgs] = useState([] as ApiOrg[]);
  const [myOrgMenuAnchor, setMyOrgMenuAnchor] = useState(null as HTMLElement | null);
  const [myOrgMenuOrg, setMyOrgMenuOrg] = useState(null as MyOrg | null);
  const [requestAccessDialogProps, setRequestAccessDialogProps] = useState({
    open: false,
    org: undefined as ApiOrg | undefined,
  });

  async function fetchAllOrgs() {
    setAllOrgs(await OrgClient.getOrgList());
  }

  async function fetchAccessRequests() {
    setAccessRequests(await UserClient.getAccessRequests());
  }

  function updateAccessRequestsLoading(org: ApiOrg, isLoading: boolean) {
    setAccessRequestsLoading({
      ...accessRequestsLoading,
      [org.id]: isLoading,
    });
  }

  async function requestAccess(org: ApiOrg) {
    updateAccessRequestsLoading(org, true);
    // TODO: Figure out how to get required info for creating access request here.
    const newRequest = await AccessRequestClient.issueAccessRequest(org.id, {} as any);

    // If we already have a request for this org, replace it. Otherwise, add the new request.
    const existingIndex = accessRequests.findIndex(req => req.org.id === newRequest.org.id);
    const accessRequestsUpdated = [...accessRequests];
    if (existingIndex !== -1) {
      accessRequestsUpdated[existingIndex] = newRequest;
    } else {
      accessRequestsUpdated.push(newRequest);
    }

    setAccessRequests(accessRequestsUpdated);
    updateAccessRequestsLoading(org, false);
  }

  async function cancelRequest(org: MyOrg) {
    await AccessRequestClient.cancelAccessRequest(org.id);
    const accessRequestsUpdated = [...accessRequests];
    const index = accessRequests.findIndex(req => req.org.id === org.id);
    if (index !== -1) {
      accessRequestsUpdated.splice(index, 1);
      setAccessRequests(accessRequestsUpdated);
    }
  }

  function handleCancelRequestClick(org: MyOrg) {
    closeMyOrgMenu();
    void cancelRequest(org);
  }

  function handleResubmitRequestClick(org: MyOrg) {
    closeMyOrgMenu();
    void requestAccess(org);
  }

  function getStatusLabel(org: MyOrg) {
    if (org.accessRequest) {
      return org.accessRequest.status;
    }

    const userRole = user.userRoles!.find(ur => ur.role.org!.id === org.id);
    return userRole?.role!.name;
  }

  function getStatusColor(org: MyOrg) {
    const status = org.accessRequest ? org.accessRequest.status : 'approved';

    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'denied':
        return 'error';
      default:
        throw new Error(`Unknown access request status "${status}"`);
    }
  }

  function getMyOrgs() {
    // Build list of orgs we're in or have made access requests to.
    const userOrgs = user.userRoles!.map(userRole => ({
      id: userRole.role.org!.id,
      name: userRole.role.org!.name,
      contact: userRole.role.org!.contact,
    })) as MyOrg[];

    const accessReqs = accessRequests.map(req => ({
      ...req.org,
      accessRequest: req,
    })) as MyOrg[];

    return userOrgs
      .concat(accessReqs)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function isMyOrgMenuOpen(org: MyOrg) {
    return (myOrgMenuOrg != null && myOrgMenuOrg.id === org.id);
  }

  function closeMyOrgMenu() {
    setMyOrgMenuAnchor(null);
    setMyOrgMenuOrg(null);
  }

  function handleMyOrgMenuOpen(e: React.MouseEvent<HTMLElement>, org: MyOrg) {
    setMyOrgMenuAnchor(e.currentTarget);
    setMyOrgMenuOrg(org);
  }

  function handleRequestAccessClick(org: ApiOrg) {
    setRequestAccessDialogProps({
      ...requestAccessDialogProps,
      open: true,
      org,
    });
  }

  function handleRequestAccessDialogClose() {
    setRequestAccessDialogProps({
      ...requestAccessDialogProps,
      open: false,
    });
  }

  function handleRequestAccessDialogComplete(accessRequest: ApiAccessRequest) {
    setAccessRequests([...accessRequests, accessRequest]);
  }

  useEffect(() => {
    // Initial load.
    async function fetchData() {
      dispatch(AppFrameActions.setPageLoading({ isLoading: true }));

      await Promise.all([
        fetchAllOrgs(),
        fetchAccessRequests(),
      ]);

      // Finish loading.
      dispatch(AppFrameActions.setPageLoading({ isLoading: false }));
    }

    void fetchData();
  }, [dispatch]);

  useEffect(() => {
    // Build a filtered list of orgs the user can request access to.
    const myOrgsLookup = {} as { [orgId: number]: boolean };

    // Filter orgs we have access requests for.
    for (const accessRequest of accessRequests) {
      myOrgsLookup[accessRequest.org.id] = true;
    }

    // Filter orgs that we're already in.
    if (user.userRoles) {
      for (const userRole of user.userRoles) {
        myOrgsLookup[userRole.role.org!.id] = true;
      }
    }

    setRequestAccessOrgs(
      allOrgs
        .filter(org => !myOrgsLookup[org.id])
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
  }, [allOrgs, accessRequests, user]);

  const myOrgs = getMyOrgs();

  return (
    <>
      <Container maxWidth="md">
        <PageHeader title="Groups" />

        {/* My Groups */}
        {(myOrgs.length > 0) && (
          <Paper className={classes.paper}>
            <Toolbar>
              <Typography variant="h6" id="tableTitle" component="div">
                My Groups
              </Typography>
            </Toolbar>

            <TableContainer>
              <Table size="small" aria-label="my groups table">
                <TableHead>
                  <TableRow>
                    <TableCell>Group Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell className={classes.emailHeader}>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myOrgs.map(org => (
                    <TableRow key={org.id}>
                      <TableCell component="th" scope="row">
                        {org.name}
                      </TableCell>
                      <TableCell>{`${org.contact!.firstName} ${org.contact!.lastName}`}</TableCell>
                      <TableCell>
                        <IconButton href={`mailto:${org.contact!.email}`} target="_blank" aria-label="email">
                          <MailOutline />
                        </IconButton>
                      </TableCell>
                      <TableCell>{org.contact!.phone}</TableCell>
                      <TableCell>
                        <StatusChip
                          label={getStatusLabel(org)}
                          color={getStatusColor(org)}
                        />
                      </TableCell>
                      {org.accessRequest ? (
                        <TableCell align="right" padding="none">
                          <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={e => handleMyOrgMenuOpen(e, org)}
                          >
                            <MoreVert />
                          </IconButton>
                          <Menu
                            open={isMyOrgMenuOpen(org)}
                            onClose={closeMyOrgMenu}
                            anchorEl={myOrgMenuAnchor}
                            getContentAnchorEl={null}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                          >
                            <MenuItem onClick={() => handleCancelRequestClick(org)}>
                              Cancel Request
                            </MenuItem>

                            {org.accessRequest.status === 'denied' && (
                              <MenuItem onClick={() => handleResubmitRequestClick(org)}>
                                Resubmit Request
                              </MenuItem>
                            )}
                          </Menu>
                        </TableCell>
                      ) : (
                        <TableCell align="right" padding="none" />
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Info Card */}
        {(!user.activeRole && accessRequests.length === 0 && isInfoCardVisible) && (
          <Card className={classes.infoCard} variant="outlined">
            <CardContent className={classes.infoCardContent}>
              <header>
                <div>You are not a member of any groups.</div>
                <p>
                  In order to use Status Engine and view data, you must first belong to a group. Joining a group is easy.
                  Simply follow these three steps and you’ll be on your way in no time!
                </p>
              </header>

              <div className={classes.infoCardStepList}>
                <div className={classes.infoCardStep}>
                  <div>
                    <span className={classes.infoCardStepNumber}>
                      1
                    </span>
                  </div>
                  <div>Find your group(s) using the table below.</div>
                </div>
                <div className={classes.infoCardStep}>
                  <div>
                    <span className={classes.infoCardStepNumber}>
                      2
                    </span>
                  </div>
                  <div>Use the Request Access button to send an access request to the group’s contact.</div>
                </div>
                <div className={classes.infoCardStep}>
                  <div>
                    <span className={classes.infoCardStepNumber}>
                      3
                    </span>
                  </div>
                  <div>Keep track of your access requests, status, and joined groups via this page.</div>
                </div>
              </div>

              <CardActions>
                <Button size="large" onClick={() => setIsInfoCardVisible(false)}>
                  Ok, I got it
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        )}

        {/* Request Access */}
        {(requestAccessOrgs.length > 0) && (
          <Paper className={classes.paper}>
            <Toolbar>
              <Typography variant="h6" id="tableTitle" component="div">
                Request Access
              </Typography>
            </Toolbar>
            <TableContainer>
              <Table size="small" aria-label="request access table">
                <TableHead>
                  <TableRow>
                    <TableCell>Group Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell className={classes.emailHeader}>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requestAccessOrgs.map(org => (
                    <TableRow key={org.name}>
                      <TableCell component="th" scope="row">
                        {org.name}
                      </TableCell>
                      <TableCell>{`${org.contact!.firstName} ${org.contact!.lastName}`}</TableCell>
                      <TableCell>
                        <IconButton href={`mailto:${org.contact!.email}`} target="_blank" aria-label="email">
                          <MailOutline />
                        </IconButton>
                      </TableCell>
                      <TableCell>{org.contact!.phone}</TableCell>
                      <TableCell>
                        <ButtonWithSpinner
                          variant="text"
                          startIcon={<PersonAdd />}
                          loading={accessRequestsLoading[org.id]}
                          onClick={() => handleRequestAccessClick(org)}
                        >
                          Request Access
                        </ButtonWithSpinner>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
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

      <RequestAccessDialog
        open={requestAccessDialogProps.open}
        org={requestAccessDialogProps.org}
        onClose={handleRequestAccessDialogClose}
        onComplete={handleRequestAccessDialogComplete}
      />
    </>
  );
};

interface MyOrg extends ApiOrg {
  accessRequest?: ApiAccessRequest;
}
