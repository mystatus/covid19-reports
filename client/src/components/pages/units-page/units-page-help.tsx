import React from 'react';
import { PageHelp } from '../../page-help/page-help';

export const UnitsPageHelp = () => {
  return (
    <PageHelp
      description={`
        This view allows you to easily manage all of the units within your group.
      `}
      bullets={[
        'Add or remove units',
        'Edit each unit’s muster requirement(s)',
        'Create group default muster requirement(s)',
      ]}
    />
  );
};
