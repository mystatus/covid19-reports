import {
  ColumnInfo,
  SavedLayoutSerialized,
} from '@covid19-reports/shared';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from './view-layout-selector.styles';
import { ViewLayoutId } from './view-layout-utils';
import { useSticky } from '../../hooks/use-sticky';
import { Modal } from '../../actions/modal.actions';
import { useAppDispatch } from '../../hooks/use-app-dispatch';

export type ViewLayoutSelectorProps = {
  columns: ColumnInfo[];
  layouts: SavedLayoutSerialized[];
  selectedLayoutId: ViewLayoutId;
  hasChanges: boolean;
  open: boolean;
  onClick: () => void;
  onClose: () => void;
  onSaveClick: () => void;
  onSaveAsClick: () => void;
  onDeleteClick: () => void;
  onSelectionChange: (layout: SavedLayoutSerialized) => void;
};

export function ViewLayoutSelector(props: ViewLayoutSelectorProps) {
  const {
    layouts,
    selectedLayoutId,
    hasChanges,
    open,
    onClick,
    onClose,
    onSaveClick,
    onSaveAsClick,
    onDeleteClick,
    onSelectionChange,
  } = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [stickyRef, shouldBeSticky] = useSticky<HTMLDivElement>(-70, 40);
  const [noticeClosed, setNoticeClosed] = useState(false);

  const selectLayoutButtonRef = useRef<HTMLButtonElement>(null);

  const currentLayout = useMemo(() => {
    return layouts.find(x => x.id === selectedLayoutId);
  }, [layouts, selectedLayoutId]);

  useEffect(() => {
    setNoticeClosed(false);
  }, [selectedLayoutId]);

  const handleRevertChanges = useCallback(async () => {
    const result = await dispatch(Modal.confirm('Revert Changes', 'Are you sure?', {
      destructive: true,
      confirmText: 'Revert',
    }));

    if (!result?.button?.value) {
      return;
    }

    const selectedLayout = layouts.find(x => x.id === selectedLayoutId);
    onSelectionChange(selectedLayout!);
  }, [dispatch, layouts, onSelectionChange, selectedLayoutId]);

  const handleCloseNotice = useCallback(() => {
    setNoticeClosed(true);
  }, [setNoticeClosed]);

  const isSticky = shouldBeSticky && !noticeClosed;

  return (
    <Box display="flex" alignItems="center">
      {(layouts.length > 1) && (
        <>
          <Button
            aria-label="Select Layout"
            onClick={onClick}
            size="large"
            startIcon={<ChevronRightIcon color="action" />}
            variant="text"
            ref={selectLayoutButtonRef}
          >
            <span className={classes.filterButtonText}>
              {currentLayout?.name ?? ''}
            </span>
          </Button>

          <Menu
            anchorEl={selectLayoutButtonRef.current}
            keepMounted
            open={open}
            onClose={() => onClose()}
          >
            {layouts.map(layout => (
              <div key={layout.id}>
                <MenuItem
                  className={classes.menuItem}
                  onClick={() => onSelectionChange(layout)}
                >
                  <span className={classes.layoutName}>
                    {layout.name}
                  </span>

                  <Tooltip title="Duplicate this layout">
                    <IconButton
                      aria-label="Duplicate"
                      component="span"
                      className={classes.iconButton}
                      onClick={onSaveAsClick}
                    >
                      <FileCopyIcon />
                    </IconButton>
                  </Tooltip>

                  {layout.id !== -1 && (
                    <Tooltip title="Delete this layout">
                      <IconButton
                        aria-label="Delete"
                        className={classes.deleteButton}
                        component="span"
                        onClick={onDeleteClick}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </MenuItem>
              </div>
            ))}
          </Menu>
        </>
      )}

      {hasChanges && (
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
                onClick={handleRevertChanges}
                size="small"
                variant="outlined"
              >
                Revert Changes
              </Button>

              {isSticky && (
                <Box display="inline-block" marginRight={2}>
                  Changes were made to this layout.
                </Box>
              )}

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
      )}
    </Box>
  );
}
