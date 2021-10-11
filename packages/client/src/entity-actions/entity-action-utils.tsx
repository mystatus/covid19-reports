import {
  EntityActionColumnItem,
  EntityActionExpressionOperation,
  EntityActionItem,
  EntityActionTableItem,
  EntityActionValueOperation,

} from './entity-action.types';
import { entityActionExpressions } from './entity-action-expressions';
import { ApiRole } from '../models/api-response';

export function getEntityActionOperationValue(operation: EntityActionValueOperation | EntityActionExpressionOperation) {
  switch (operation.type) {
    case 'value':
      return operation.value;
    case 'expression':
      return entityActionExpressions[operation.expressionKey]();
    default:
      throw new Error(`Unknown action operation type`);
  }
}

export function isEntityActionTableItem(action: EntityActionItem): action is EntityActionTableItem {
  switch (action.type) {
    case 'table-button-item-baked':
      return true;
    default:
      return false;
  }
}

export function isEntityActionColumnItem(action: EntityActionItem): action is EntityActionColumnItem {
  switch (action.type) {
    case 'column-button-item':
    case 'column-button-item-baked':
    case 'column-editor-item':
      return true;
    default:
      return false;
  }
}

export function isEntityActionAllowed(action: EntityActionItem, role: ApiRole) {
  return !action.requiredPermissions.some(permission => !role[permission]);
}
