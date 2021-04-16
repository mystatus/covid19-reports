import React from 'react';
import { PageHelp } from '../../page-help/page-help';

export const RosterColumnsPageHelp = () => {
  return (
    <PageHelp
      description={`
        Create and manage custom columns that appear on your group’s roster.
      `}
      bullets={[
        'Add or Delete custom columns',
        'Edit custom column flags (e.g. Contains PII, Required, Multiline, etc.)',
      ]}
    />
  );
};
