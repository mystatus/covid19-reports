import React from 'react';
import {
  EntityActionRenderAs,
  EntityActionTableButtonItemBaked,
} from '../../entity-actions/entity-action.types';
import { entityActionBakedTableComponents } from '../../entity-actions/entity-action-baked';

export type EntityActionTableElementProps = {
  action: EntityActionTableButtonItemBaked | undefined;
  renderAs: EntityActionRenderAs;
  onComplete?: () => void;
};

export function EntityActionTableElement(props: EntityActionTableElementProps) {
  const { action, renderAs, onComplete } = props;

  if (!action) {
    return <div>Err: Action Not Found</div>;
  }

  // NOTE: Table actions can only be baked action items at the moment.

  const EntityActionTableBakedButton = entityActionBakedTableComponents[action.id];
  return (
    <EntityActionTableBakedButton
      action={action}
      renderAs={renderAs}
      onComplete={onComplete}
    />
  );
}
