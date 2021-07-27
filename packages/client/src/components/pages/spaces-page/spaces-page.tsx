import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Workspace } from '../../../actions/workspace.actions';
import {
  ApiDashboard,
  ApiWorkspace,
} from '../../../models/api-response';
import { UserSelector } from '../../../selectors/user.selector';
import { WorkspaceSelector } from '../../../selectors/workspace.selector';
import { getDashboardUrl } from '../../../utility/url-utils';
import { Link } from '../../link/link';
import PageHeader from '../../page-header/page-header';
import { SpacesPageHelp } from './spaces-page-help';
import useStyles from './spaces-page.styles';
import { AppFrameActions } from '../../../slices/app-frame.slice';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { UserActions } from '../../../slices/user.slice';
import { useAppSelector } from '../../../hooks/use-app-selector';

export const SpacesPage = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const orgId = useAppSelector(UserSelector.orgId)!;
  const favoriteDashboards = useAppSelector(UserSelector.favoriteDashboards)!;
  const workspaces = useAppSelector(UserSelector.workspaces)!;
  const dashboards = useAppSelector(WorkspaceSelector.dashboards)!;

  useEffect(() => {
    dispatch(AppFrameActions.setPageLoading({ isLoading: true }));
    dispatch(UserActions.refresh());
    dispatch(Workspace.fetch(orgId));
  }, [dispatch, orgId]);

  useEffect(() => {
    (async () => {
      for (const workspace of workspaces) {
        await dispatch(Workspace.fetchDashboards(orgId, workspace.id));
      }

      dispatch(AppFrameActions.setPageLoading({ isLoading: false }));
    })();
  }, [dispatch, orgId, workspaces]);

  const handleFavoriteButtonClick = (workspace: ApiWorkspace, dashboard: ApiDashboard) => {
    if (isDashboardFavorited(workspace, dashboard)) {
      dispatch(UserActions.removeFavoriteDashboard({
        orgId,
        workspaceId: workspace.id,
        dashboardUuid: dashboard.uuid,
      }));
    } else {
      dispatch(UserActions.addFavoriteDashboard({
        orgId,
        workspaceId: workspace.id,
        dashboardUuid: dashboard.uuid,
      }));
    }
  };

  const isDashboardFavorited = (workspace: ApiWorkspace, dashboard: ApiDashboard) => {
    if (favoriteDashboards[workspace.id]) {
      return Boolean(favoriteDashboards[workspace.id][dashboard.uuid]);
    }

    return false;
  };

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <PageHeader
          title="Spaces"
          help={{
            contentComponent: SpacesPageHelp,
            cardId: 'spacesPage',
          }}
        />

        <Grid container spacing={3}>
          {workspaces.map(workspace => (
            <Grid item xs={12} key={workspace.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {workspace.name}
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.favoriteCell} />
                          <TableCell>Name</TableCell>
                          <TableCell>Description</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {(dashboards[workspace.id] ?? []).map(dashboard => (
                          <TableRow key={dashboard.uuid}>
                            <TableCell className={classes.favoriteCell}>
                              <IconButton
                                onClick={() => handleFavoriteButtonClick(workspace, dashboard)}
                                disableRipple
                                aria-label="favorite-button"
                              >
                                {isDashboardFavorited(workspace, dashboard) ? (
                                  <FavoriteIcon className={classes.favoriteIconOn} />
                                ) : (
                                  <FavoriteBorderIcon className={classes.favoriteIconOff} />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <Link href={getDashboardUrl(orgId, workspace.id, dashboard.uuid)}>
                                {dashboard.title}
                              </Link>
                            </TableCell>
                            <TableCell>{dashboard.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
};
