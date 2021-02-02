import { Tooltip } from '@material-ui/core';
import React from 'react';
import { tooltipText } from '../../../utility/tooltip-text';
import { PageHelp } from '../../page-help/page-help';
import { TooltipChild } from '../../tooltip-child/tooltip-child';

export const WorkspacesPagesHelp = () => {
  return (
    <PageHelp
      description={(
        <>
          A Workspace is a set of dashboards that a user role can access. Dashboards are accessed through the Analytics
          menu item on the left-hand side menu. StatusEngine currently has three Workspace templates to chose from when
          creating a Workspace. They correspond to the three levels of data access a user can have
          (<NonPii />, <Pii />, or <Phi />).
        </>
      )}
      bullets={[
        'Add, Edit, or Delete workspaces',
        'Edit a workspace’s name',
        'Edit a workspace’s description',
      ]}
    />
  );
};

const NonPii = () => (
  <Tooltip title={tooltipText.nonPii}>
    <TooltipChild>Non-PII</TooltipChild>
  </Tooltip>
);

const Pii = () => (
  <Tooltip title={tooltipText.pii}>
    <TooltipChild>PII</TooltipChild>
  </Tooltip>
);

const Phi = () => (
  <Tooltip title={tooltipText.phi}>
    <TooltipChild>PHI</TooltipChild>
  </Tooltip>
);
