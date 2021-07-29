import React, { ElementType } from 'react';
import {
  Box,
  Typography,
} from '@material-ui/core';
import { HelpButton } from '../help/help-button/help-button';
import { HelpCard } from '../help/help-card/help-card';
import useStyles from './page-header.styles';

export interface PageHeaderProps {
  title: string;
  help?: {
    contentComponent: ElementType;
    cardId: string;
    variant?: 'plain' | 'info';
  };
}

const PageHeader = (props: PageHeaderProps) => {
  const { title, help } = props;
  const HelpContent = help?.contentComponent;
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <Box display="flex" alignItems="center">
        <Typography className={classes.title}>
          {title}
        </Typography>

        {help && (
          <HelpButton
            title={title}
            contentComponent={help.contentComponent}
            variant={help.variant}
          />
        )}
      </Box>

      {(help && HelpContent) && (
        <Box className={classes.helpCardContainer}>
          <HelpCard helpCardId={help.cardId} variant={help.variant}>
            <HelpContent />
          </HelpCard>
        </Box>
      )}
    </header>
  );
};

export default PageHeader;
