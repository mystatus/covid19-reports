import React from 'react';
import { EntityActionTableButtonBakedProps } from '../../entity-actions/entity-action.types';
import { entityActionBakedTableComponents } from '../../entity-actions/entity-action-baked';

export function EntityActionTableElement(props: EntityActionTableButtonBakedProps) {
  const { action, renderAs, onClick, onComplete } = props;

  if (!action) {
    return <div>Err: Action Not Found</div>;
  }

  // NOTE: Table actions can only be baked action items at the moment.

  const EntityActionTableBakedButton = entityActionBakedTableComponents[action.id];
  return (
    <EntityActionTableBakedButton
      action={action}
      renderAs={renderAs}
      onClick={onClick}
      onComplete={onComplete}
    />
  );
}
