import React, {
  useRef,
  useState,
} from 'react';
import FlashOnOutlinedIcon from '@material-ui/icons/FlashOnOutlined';
import { EntityType } from '@covid19-reports/shared';
import { Box, Button, IconButton, Menu, MenuItem } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import useStyles from './column-selector.styles';
import { executeAction, getBulkActions } from '../../entity-actions/actions';
import { UserState } from '../../slices/user.slice';

export type ActionSelectorProps = {
  entityType: EntityType;
  onActionPinned: (action: any) => void;
  user: UserState;
};

export function ActionSelector(props: ActionSelectorProps) {
  const { entityType, onActionPinned, user } = props;
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggleButtonRef = useRef<HTMLSpanElement>(null);
  const actions = getBulkActions(entityType, user.activeRole?.role);

  if (actions.length === 0) {
    return (<></>);
  }

  return (
    <>
      <Button
        aria-label="Actions"
        className={classes.tableHeaderButton}
        onClick={() => setMenuOpen(true)}
        size="small"
        startIcon={<FlashOnOutlinedIcon />}
        variant="outlined"
      >
        <span ref={menuToggleButtonRef}>
          Actions
        </span>
      </Button>

      <Menu
        id="layout-actions-menu"
        anchorEl={menuToggleButtonRef.current}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        {actions.map(action => (
          <MenuItem
            key={action.name}
            onClick={() => {
              void executeAction(entityType, action);
              setMenuOpen(false);
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" width="300px">
              <span>{action.displayName}</span>

              <IconButton
                onClick={e => {
                  onActionPinned(action);
                  e.preventDefault();
                }}
                aria-label="Toggle"
                size="small"
              >
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>

            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
