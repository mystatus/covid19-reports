import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  IconButton,
  Paper,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import UndoIcon from '@material-ui/icons/Undo';
import useStyles from './view-layout-buttons.styles';
import { useSticky } from '../../hooks/use-sticky';
import { ViewLayoutId } from './view-utils';

export type ViewLayoutButtonsProps = {
  selectedLayoutId: ViewLayoutId;
  onSaveClick: () => void;
  onRevertClick: () => void;
};

export function ViewLayoutButtons(props: ViewLayoutButtonsProps) {
  const { selectedLayoutId, onSaveClick, onRevertClick } = props;
  const classes = useStyles();

  const [noticeClosed, setNoticeClosed] = useState(false);
  const [stickyRef, shouldBeSticky] = useSticky<HTMLDivElement>(-70, 40);

  useEffect(() => {
    setNoticeClosed(false);
  }, [selectedLayoutId]);

  const handleCloseNotice = useCallback(() => {
    setNoticeClosed(true);
  }, [setNoticeClosed]);

  const isSticky = shouldBeSticky && !noticeClosed;

  return (
    <>
      <div
        className={classes.stickyDiv}
        ref={stickyRef}
      >
        <Paper
          elevation={isSticky ? 6 : 0}
          className={isSticky ? classes.saveNoticeSticky : classes.saveNoticeStatic}
        >
          <>
            <Button
              aria-label="Save"
              className={classes.button}
              onClick={onSaveClick}
              size="small"
              startIcon={<SaveIcon />}
              variant="outlined"
            >
              Save Layout
            </Button>

            <Button
              className={classes.revertButton}
              onClick={onRevertClick}
              size="small"
              startIcon={<UndoIcon />}
              variant="outlined"
            >
              Revert Layout Changes
            </Button>

            {isSticky && (
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseNotice}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </>
        </Paper>
      </div>
    </>
  );
}
