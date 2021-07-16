import { Tooltip } from '@material-ui/core';
import React from 'react';
import { tooltipText } from '../../../utility/tooltip-text';
import { PageHelp } from '../../page-help/page-help';
import { TooltipChild } from '../../tooltip-child/tooltip-child';

export const EditSpacesPageHelp = () => {
  return (
    <PageHelp
      description={(
        <>
          A Space is a set of dashboards that a user role can access. Dashboards are accessed through the Spaces
          menu item on the left-hand side menu. StatusEngine currently has three Space templates to chose from when
          creating a Space. They correspond to the three levels of data access a user can have
          (<NonPii />, <Pii />, or <Phi />).
        </>
      )}
      bullets={[
        'Add, Edit, or Delete spaces',
        'Edit a space’s name',
        'Edit a space’s description',
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
