import React from 'react';
import { PageHelp } from '../../page-help/page-help';

export const ObservationsPageHelp = () => {
  return (
    <PageHelp
      description={`
        Observations rock.
      `}
      bullets={[
        'Identify and resolve misplaced observations',
        'Filter the Observations by any number of columns and combinations',
        'Show or hide columns',
      ]}
    />
  );
};
