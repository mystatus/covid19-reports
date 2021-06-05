import React from 'react';
import { PageHelp } from '../../page-help/page-help';

export const MusterPageHelp = () => {
  return (
    <PageHelp
      description={`
        This view highlights individuals and units who have a higher than normal Non-muster Rate per their established
        muster requirements. The table displays the individuals, while the two graphs (below) show offending units by
        weekly and monthly trends.
      `}
      bullets={[
        'Identify individuals who have a high Non-muster Rate',
        'Identify units that have a high Non-muster Rate',
        `Export a CSV file containing all non-compliant individuals' muster data`,
      ]}
    />
  );
};
