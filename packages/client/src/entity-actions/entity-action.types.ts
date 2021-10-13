import React from 'react';
import {
  ColumnInfo,
  EntityType,
  RolePermission,
} from '@covid19-reports/shared';
import {
  entityActionBakedColumnItems,
  EntityActionBakedTableItemIds,
} from './entity-action-baked';
import { OverrideType } from '../utility/typescript-utils';
import { EntityTableRow } from '../components/tables/table-custom-columns-content';
import { EntityActionExpressionKey } from './entity-action-expressions';

export type EntityActionValueOperation = {
  type: 'value';
  columnName: string;
  value: string;
};

export type EntityActionExpressionOperation = {
  type: 'expression';
  columnName: string;
  expressionKey: EntityActionExpressionKey;
};

export type EntityActionEditorValueOperation = {
  type: 'editorValue';
  columnName: string;
};

export type EntityActionOperation =
  | EntityActionValueOperation
  | EntityActionExpressionOperation
  | EntityActionEditorValueOperation;

export type EntityActionItem =
  | EntityActionColumnItem
  | EntityActionTableItem;

export type EntityActionColumnItem =
  | EntityActionColumnButtonItem
  | EntityActionColumnEditorItem
  | EntityActionColumnButtonItemBaked;

export type EntityActionTableItem =
  | EntityActionTableButtonItemBaked;

export type EntityActionButtonItem =
  | EntityActionColumnButtonItem
  | EntityActionColumnButtonItemBaked
  | EntityActionTableButtonItemBaked;

type EntityActionItemBase = {
  type: string;
  id: string;
  entityType: EntityType;
  displayName: string;
  operation: EntityActionOperation;
  requiredPermissions: ReadonlyArray<RolePermission>;
};

export type EntityActionColumnButtonItem = OverrideType<EntityActionItemBase, {
  type: 'column-button-item';
}>;

export type EntityActionColumnEditorItem = OverrideType<EntityActionItemBase, {
  type: 'column-editor-item';
}>;

export type EntityActionColumnButtonItemBaked = OverrideType<EntityActionItemBase, {
  type: 'column-button-item-baked';
  id: keyof typeof entityActionBakedColumnItems;
  operation: undefined;
}>;

export type EntityActionTableButtonItemBaked = OverrideType<EntityActionItemBase, {
  type: 'table-button-item-baked';
  id: EntityActionBakedTableItemIds;
  operation: undefined;
}>;

export type EntityActionRenderAs =
  | 'inline'
  | 'menuItem';

export type EntityActionColumnButtonBakedProps<TEntityType extends EntityType> = {
  action: EntityActionColumnButtonItemBaked;
  columns: ColumnInfo[];
  row: EntityTableRow<TEntityType>;
  rows: EntityTableRow<TEntityType>[];
  renderAs: EntityActionRenderAs;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLLIElement>) => void;
  onComplete?: () => void;
};

export type EntityActionTableButtonBakedProps = {
  action: EntityActionTableButtonItemBaked;
  renderAs: EntityActionRenderAs;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLLIElement>) => void;
  onComplete?: () => void;
};
