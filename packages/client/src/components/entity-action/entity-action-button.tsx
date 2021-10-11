import React from 'react';
import { MenuItem } from '@material-ui/core';
import {
  EntityActionButtonItem,
  EntityActionRenderAs,
} from '../../entity-actions/entity-action.types';
import { ButtonWithSpinner } from '../buttons/button-with-spinner';

export type EntityActionButtonProps = {
  action: EntityActionButtonItem;
  renderAs: EntityActionRenderAs;
  onClick?: () => void;
  loading?: boolean;
};

export function EntityActionButton(props: EntityActionButtonProps) {
  const { action, renderAs, onClick, loading } = props;

  switch (renderAs) {
    case 'inline':
      return (
        <ButtonWithSpinner
          key={action.id}
          onClick={onClick}
          loading={loading}
        >
          {action.displayName}
        </ButtonWithSpinner>
      );
    case 'menuItem':
      return (
        <MenuItem
          key={action.id}
          onClick={onClick}
        >
          {action.displayName}
        </MenuItem>
      );
    default:
      return <div>Err: Unknown 'renderAs' value</div>;
  }
}
