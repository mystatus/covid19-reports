import React from 'react';
import { PageHelp } from '../../page-help/page-help';

export const MusterConfigPageHelp = () => {
  return (
    <PageHelp
      description={`
        This view allows you to easily manage muster requirements for your group.
      `}
      bullets={[
        'Add or remove muster configurations',
        'Edit which roster groups each muster configuration will apply to',
      ]}
    />
  );
};
