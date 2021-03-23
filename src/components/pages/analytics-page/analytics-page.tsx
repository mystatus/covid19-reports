import React, { useEffect } from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { AppFrame } from '../../../actions/app-frame.actions';
import { User } from '../../../actions/user.actions';
import { UserSelector } from '../../../selectors/user.selector';
import { Link } from '../../link/link';
import PageHeader from '../../page-header/page-header';
import { TypographyTruncated } from '../../typography-truncated/typography-truncated';
import { AnalyticsPageHelp } from './analytics-page-help';
import useStyles from './analytics-page.styles';

export const AnalyticsPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const orgId = useSelector(UserSelector.orgId)!;
  const workspaces = useSelector(UserSelector.workspaces)!;

  const initializeTable = React.useCallback(async () => {
    dispatch(AppFrame.setPageLoading(true));
    await dispatch(User.refresh());
    dispatch(AppFrame.setPageLoading(false));
  }, [dispatch]);

  useEffect(() => {
    initializeTable().then();
  }, [initializeTable]);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <PageHeader
          title="Analytics Workspaces"
          help={{
            contentComponent: AnalyticsPageHelp,
            cardId: 'analyticsPage',
          }}
        />

        <Grid container spacing={3}>
          {workspaces.map(workspace => (
            <Grid item xs={6} key={workspace.id}>
              <Link href={`/dashboard?orgId=${orgId}&workspaceId=${workspace.id}`}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Box display="flex">
                      <Box flex={1} minWidth={0}>
                        <TypographyTruncated
                          className={classes.workspaceName}
                          lines={1}
                        >
                          {workspace.name}
                        </TypographyTruncated>

                        <TypographyTruncated
                          className={classes.workspaceDescription}
                          lines={2}
                        >
                          {workspace.description}
                        </TypographyTruncated>
                      </Box>

                      <Box display="flex" alignItems="center">
                        <IconButton>
                          <ArrowForwardIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
};
