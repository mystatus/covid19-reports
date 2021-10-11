import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import _ from 'lodash';
import FlashOnOutlinedIcon from '@material-ui/icons/FlashOnOutlined';
import { EntityType } from '@covid19-reports/shared';
import {
  Button,
  Menu,
} from '@material-ui/core';
import useStyles from './column-selector.styles';
import { useAppSelector } from '../../hooks/use-app-selector';
import { EntityActionTableButtonItemBaked } from '../../entity-actions/entity-action.types';
import { EntityActionRegistrySelector } from '../../selectors/entity-action-registry.selector';
import { EntityActionTableElement } from '../entity-action/entity-action-table-element';
import { UserSelector } from '../../selectors/user.selector';
import {
  isEntityActionAllowed,
  isEntityActionTableItem,
} from '../../entity-actions/entity-action-utils';

export type EntityActionSelectorProps = {
  entityType: EntityType;
};

export function EntityActionSelector(props: EntityActionSelectorProps) {
  const { entityType } = props;
  const classes = useStyles();

  const actions = useAppSelector(EntityActionRegistrySelector.all);
  const role = useAppSelector(UserSelector.role)!;

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | undefined>();

  const entityActions = useMemo<EntityActionTableButtonItemBaked[]>(() => {
    return _.chain(actions)
      .values()
      .filter(action => action.entityType === entityType)
      .filter(action => isEntityActionTableItem(action))
      .filter(action => isEntityActionAllowed(action, role))
      .value() as EntityActionTableButtonItemBaked[];
  }, [actions, entityType, role]);

  const handleClickButton = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setMenuAnchorEl(undefined);
  }, []);

  if (entityActions.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        aria-label="Actions"
        className={classes.tableHeaderButton}
        onClick={handleClickButton}
        size="small"
        startIcon={<FlashOnOutlinedIcon />}
        variant="outlined"
      >
        Actions
      </Button>

      <Menu
        id="layout-actions-menu"
        anchorEl={menuAnchorEl}
        open={!!menuAnchorEl}
        onClose={handleClose}
      >
        {entityActions.map(action => (
          <EntityActionTableElement
            key={action.id}
            action={action}
            renderAs="menuItem"
            onComplete={handleClose}
          />
        ))}
      </Menu>
    </>
  );
}
