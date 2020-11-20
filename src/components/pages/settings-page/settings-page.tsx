import {
  Container, Tab, Tabs,
} from '@material-ui/core';
import React, { useState } from 'react';
import PageHeader from '../../page-header/page-header';
import useStyles from './settings-page.styles';
import { AlertDialog, AlertDialogProps } from '../../alert-dialog/alert-dialog';
import { NotificationsTab } from './notifications-tab';
import { ProfileDetailsTab } from './profile-details-tab';

export interface TabPanelProps {
  index: number;
  value: number;
  setAlertDialogProps: (props: AlertDialogProps) => void
}

function tabHeaderProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

function tabProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-labelledby': `tabpanel-${index}`,
  };
}

export const SettingsPage = () => {
  const classes = useStyles();
  const [alertDialogProps, setAlertDialogProps] = useState<AlertDialogProps>({ open: false });
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <PageHeader title="Settings" />

        <div className={classes.tabsRoot}>
          <Tabs
            value={value}
            onChange={handleChange}
            orientation="vertical"
            className={classes.tabs}
          >
            <Tab
              label="Notifications"
              disableRipple
              {...tabHeaderProps(0)}
            />
            <Tab
              label="Profile Details"
              disableRipple
              {...tabHeaderProps(1)}
            />
          </Tabs>
          <NotificationsTab
            value={value}
            index={0}
            setAlertDialogProps={setAlertDialogProps}
            {...tabProps(0)}
          />
          <ProfileDetailsTab
            value={value}
            index={1}
            setAlertDialogProps={setAlertDialogProps}
            {...tabProps(1)}
          />
        </div>
      </Container>
      {alertDialogProps.open && (
        <AlertDialog open={alertDialogProps.open} title={alertDialogProps.title} message={alertDialogProps.message} onClose={alertDialogProps.onClose} />
      )}
    </main>
  );
};
