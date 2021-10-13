import React from 'react';
import { PageHelp } from '../../page-help/page-help';

export const RoleManagementPageHelp = () => {
  return (
    <PageHelp
      description={`
        Every user in StatusEngine is assigned a role when accepted to a group. A role defines access to notifications, 
        certain roster information, and other management permissions.
      `}
      bullets={[
        'Add, Edit, or Delete roles',
        'Edit role metadata: Role Name, Description, Allowed Notifications, and Role Permissions',
      ]}
    />
  );
};
