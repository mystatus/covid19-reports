import React from 'react';
import { PageHelp } from '../../page-help/page-help';

export const RosterColumnsPageHelp = () => {
  return (
    <PageHelp
      description={`
        Create and manage custom columns that appear on your group’s roster.
      `}
      bullets={[
        'Add, Edit, or Delete custom columns',
        'Edit a custom column’s display name',
        'Edit custom column flags (e.g. Contains PII, Required, Multiline, etc.)',
      ]}
    />
  );
};
