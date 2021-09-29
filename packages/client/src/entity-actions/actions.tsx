import React, { Dispatch, useCallback, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { ColumnInfo, ColumnType, EntityType } from '@covid19-reports/shared';

export type ActionInfo = Pick<ColumnInfo, 'name' | 'displayName' | 'pii' | 'phi'> & {
  refetchEntities: boolean;
};

export type ColumnActionInfo = ActionInfo & {
  canMenu: boolean;
};

export type Deferred<T> = {
  resolve: (result: T | PromiseLike<T>) => void;
  reject: (error: unknown) => void;
  promise: Promise<T>;
};

export function defer<T = any>() {
  const deferred: Partial<Deferred<T>> = {};

  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred as Deferred<T>;
}

export type ActionExecutionContext = {
  id: string;
  action: BulkAction | ColumnAction;
  data?: any;
  deferred: Deferred<any>;
  entityType: EntityType;
  entity?: any;
};

export class BulkAction {

  constructor(
    public readonly actionInfo: ActionInfo,
    public execute: (data?: any) => Promise<Deferred<any>>,
    public activeRender?: (executionContext: ActionExecutionContext) => JSX.Element,
  ) {
    this.execute = this.execute.bind(this);
    this.activeRender = this.activeRender?.bind(this);
  }

  get name() {
    return this.actionInfo.name;
  }
  get displayName() {
    return this.actionInfo.displayName;
  }
  get refetchEntities() {
    return this.actionInfo.refetchEntities;
  }

}

export class ColumnAction {

  private readonly columnInfo: ColumnActionInfo & ColumnInfo;

  constructor(
    actionInfo: ColumnActionInfo,
    public execute: (entity: any, data?: any) => Promise<Deferred<any>>,
    public render: (entity: any) => JSX.Element,
    public activeRender?: (executionContext: ActionExecutionContext) => JSX.Element,
  ) {
    this.columnInfo = {
      ...actionInfo,
      type: ColumnType.String,
      custom: false,
      required: false,
      updatable: false,
    };
    this.execute = this.execute.bind(this);
    this.render = this.render.bind(this);
    this.activeRender = this.activeRender?.bind(this);
  }

  get name() {
    return this.columnInfo.name;
  }
  get displayName() {
    return this.columnInfo.displayName;
  }
  get refetchEntities() {
    return this.columnInfo.refetchEntities;
  }
  asColumnInfo(): ColumnActionInfo & ColumnInfo {
    return this.columnInfo;
  }

}


type ActionRegistry = Record<EntityType, {
  active: ActionExecutionContext[];
  bulk: Record<string, BulkAction>;
  columns: Record<string, ColumnAction>;
  subscribers: Set<Dispatch<ActionExecutionContext[]>>;
}>;

const actions: ActionRegistry = {
  observation: {
    active: [],
    bulk: {},
    columns: {},
    subscribers: new Set(),
  },
  roster: {
    active: [],
    bulk: {},
    columns: {},
    subscribers: new Set(),
  },
};

export const getBulkAction = (entityType: EntityType, action: string) => actions[entityType].bulk[action];
export const getColumnAction = (entityType: EntityType, action: string) => actions[entityType].columns[action];
export const getBulkActions = (entityType: EntityType) => {
  return Object.values(actions[entityType].bulk)
    .sort((a, b) => a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' }));
};
export const getColumnActions = (entityType: EntityType) => Object.values(actions[entityType].columns);
export const isAction = (entityType: EntityType, action: string) => !!(getColumnAction(entityType, action) || getBulkAction(entityType, action));

export const getActionColumnInfos = (entityType: EntityType) => {
  return getColumnActions(entityType)
    .map(action => action.asColumnInfo())
    .sort((a, b) => a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' }));
};

export const getRegistry = (entityType: EntityType) => ({
  entityType,
  register: (action: ColumnAction | BulkAction) => {
    if (action instanceof ColumnAction) {
      actions[entityType].columns[action.name] = action;
    } else {
      actions[entityType].bulk[action.name] = action;
    }
  },
});

export type RenderActiveActionProps = {
  entityType: EntityType;
  refetchEntities: () => void;
};

export const RenderActiveAction = ({ entityType, refetchEntities }: RenderActiveActionProps) => {
  const [activeActions, setActiveActions] = useState<ActionExecutionContext[]>([]);

  const subscriber = useCallback((contexts: ActionExecutionContext[]) => {
    setActiveActions(contexts);
    refetchEntities();
  }, [refetchEntities, setActiveActions]);

  useEffect(() => {
    actions[entityType].subscribers.add(subscriber);

    return () => {
      actions[entityType].subscribers.delete(subscriber);
    };
  }, [entityType, subscriber]);

  return (
    <>
      {activeActions.map(executionContext => (
        <div key={executionContext.id}>
          {executionContext.action.activeRender!(executionContext)}
        </div>
      ))}
    </>
  );
};

export const executeAction = async (entityType: EntityType, action: BulkAction | ColumnAction, entity?: any, data?: any) => {
  const deferred = await (action instanceof BulkAction ? action.execute(data) : action.execute(entity, data));

  if (!action.activeRender) {
    return deferred.promise;
  }

  const executionContext: ActionExecutionContext = {
    id: v4(),
    action,
    deferred,
    data,
    entityType,
    entity,
  };

  actions[entityType].active = [
    ...actions[entityType].active,
    executionContext,
  ];

  actions[entityType].subscribers.forEach(subscriber => subscriber([...actions[entityType].active]));

  return deferred.promise
    // eslint-disable-next-line promise/prefer-await-to-then
    .finally(() => {
      actions[entityType].active = actions[entityType].active.filter(context => context !== executionContext);
      actions[entityType].subscribers.forEach(subscriber => subscriber(actions[entityType].active));
    });
};
