import React from 'react';
import { PageHelp } from '../../page-help/page-help';

export const MusterPageHelp = () => {
  return (
    <PageHelp
      description={`
        This view highlights individuals and units who have a lower than normal muster rate per their established
        muster requirements. The table displays the individuals, while the two graphs (below) show offending units by
        weekly and monthly trends.
      `}
      bullets={[
        'Identify individuals who have a low muster rate',
        'Identify units that have a low muster rate',
        `Export a CSV file containing all individuals' muster data`,
      ]}
    />
  );
};
