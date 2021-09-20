import React, { ElementType } from 'react';
import {
  Box,
  Typography,
} from '@material-ui/core';
import { HelpButton } from '../help/help-button/help-button';
import { HelpCard } from '../help/help-card/help-card';
import useStyles from './page-header.styles';

export type PageHeaderHelpProps = {
  contentComponent: ElementType;
  cardId: string;
  variant?: 'plain' | 'info';
};

export interface PageHeaderProps {
  title: string;
  leftComponent?: React.ReactElement;
  rightComponent?: React.ReactElement;
  help?: {
    contentComponent: ElementType;
    cardId: string;
    variant?: 'plain' | 'info';
  };
}

const PageHeader = (props: PageHeaderProps) => {
  const { leftComponent, rightComponent, help, title } = props;
  const HelpContent = help?.contentComponent;
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Typography className={classes.title} component="h1">
            {title}
          </Typography>

          {leftComponent}
        </Box>

        <Box display="flex" alignItems="center">
          {rightComponent}

          {(help && HelpContent) && (
            <HelpButton
              title={title}
              contentComponent={HelpContent}
              variant={help.variant}
            />
          )}
        </Box>
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
