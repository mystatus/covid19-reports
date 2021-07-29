import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import React, {
  ElementType,
  ReactNode,
  useState,
} from 'react';
import { HelpContent } from '../help-content/help-content';

export interface HelpButtonProps {
  title: string;
  contentComponent: ElementType;
  children?: ReactNode;
  variant?: 'plain' | 'info';
}

export const HelpButton = (props: HelpButtonProps) => {
  const { title, contentComponent: ContentComponent, children, variant } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        {children}
        {!children && (
          <InfoOutlinedIcon />
        )}
      </IconButton>

      <Dialog open={open} maxWidth="md" onClose={() => setOpen(false)}>
        {variant !== 'plain' && (
          <DialogTitle>
            {title}
          </DialogTitle>
        )}

        <DialogContent>
          <HelpContent>
            <ContentComponent />
          </HelpContent>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
