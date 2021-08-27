import React from 'react';
import { PageHelp } from '../../page-help/page-help';

export const ObservationsPageHelp = () => {
  return (
    <PageHelp
      description={`
        Observations are simply the list of reports submitted by individuals on your Roster.
      `}
      bullets={[
        'Identify and resolve misplaced observations',
        'Filter the Observations by any number of columns and combinations',
      ]}
    />
  );
};
