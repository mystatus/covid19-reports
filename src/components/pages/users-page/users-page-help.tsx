import React from 'react';
import { PageHelp } from '../../page-help/page-help';

export const UsersPageHelp = () => {
  return (
    <PageHelp
      description={`
        This view allows you to manage all users within your group. When a new user requests access to join the group,
        it will appear in a table labeled “Access Requests” for you to approve or deny the request. If there are no
        Access Requests, the table will be hidden.
      `}
      bullets={[
        'Change a user’s role within the group',
        'Delete a user from the group',
        'View all user access requests (when applicable)',
        'Approve or Deny user access requests (when applicable)',
      ]}
    />
  );
};
