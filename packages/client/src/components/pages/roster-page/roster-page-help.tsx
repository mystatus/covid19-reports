import React from 'react';
import { PageHelp } from '../../page-help/page-help';

export const RosterPageHelp = () => {
  return (
    <PageHelp
      description={`
        The roster is simply the list of individuals within your group. By default, StatusEngine displays the following
        columns: DoD ID, First Name, Last Name, Unit, and Last Reported. Additional custom columns may be added by
        visiting the Roster Columns view.
      `}
      bullets={[
        'Upload a CSV file to append entries to the existing roster',
        'Download a CSV template containing all roster columns (including custom columns) ',
        'Export all your group’s roster data to a CSV file',
        'Add, Edit, or Delete individual roster entries',
        'Delete all roster entries',
        'Filter the roster by any number of columns and combinations',
        'Show or hide columns',
      ]}
    />
  );
};
