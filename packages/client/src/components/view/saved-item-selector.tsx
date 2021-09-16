import React, {
  MouseEvent,
} from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  Tooltip,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import useStyles from './saved-item-selector.styles';

export type SavedItemSelectorItem = {
  id: number | string;
  name: string;
};

export type SavedItemSelectorProps<TItem extends SavedItemSelectorItem> = {
  anchorEl: MenuProps['anchorEl'];
  open: boolean;
  onClose: () => void;
  items: TItem[];
  onItemClick: (item: TItem) => void;
  onItemDuplicateClick: (item: TItem) => void;
  onItemDeleteClick: (item: TItem) => void;
  showItemDuplicateButton?: (item: TItem) => boolean;
  showItemDeleteButton?: (item: TItem) => boolean;
};

export function SavedItemSelector<TItem extends SavedItemSelectorItem>(
  props: SavedItemSelectorProps<TItem>,
) {
  const {
    anchorEl,
    open,
    onClose,
    items,
    onItemDuplicateClick,
    onItemDeleteClick,
    onItemClick,
    showItemDuplicateButton = () => true,
    showItemDeleteButton = () => true,
  } = props;
  const classes = useStyles();

  const handleItemDuplicateClick = (event: MouseEvent, item: TItem) => {
    event.stopPropagation();
    onItemDuplicateClick(item);
    onClose();
  };

  const handleItemDeleteClick = (event: MouseEvent, item: TItem) => {
    event.stopPropagation();
    onItemDeleteClick(item);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      {items.map(item => (
        <MenuItem
          key={item.id}
          className={classes.menuItem}
          onClick={() => onItemClick(item)}
        >
          <span className={classes.itemName}>
            {item.name}
          </span>

          <Box
            display="inline-block"
            visibility={showItemDuplicateButton(item) ? 'visible' : 'hidden'}
          >
            <Tooltip title="Duplicate">
              <IconButton
                aria-label="Duplicate"
                className={classes.iconButton}
                component="span"
                onClick={(event: MouseEvent) => handleItemDuplicateClick(event, item)}
              >
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box
            display="inline-block"
            visibility={showItemDeleteButton(item) ? 'visible' : 'hidden'}
          >
            <Tooltip title="Delete">
              <IconButton
                aria-label="Delete"
                className={classes.deleteButton}
                component="span"
                onClick={(event: MouseEvent) => handleItemDeleteClick(event, item)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </MenuItem>
      ))}
    </Menu>
  );
}
