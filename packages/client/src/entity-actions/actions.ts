import {
  ColumnInfo,
  ColumnType,
  EntityType,
} from '@covid19-reports/shared';

type ActionInfo = Pick<ColumnInfo, 'name' | 'displayName' | 'pii' | 'phi'>;

type ColumnActionInfo = Pick<ColumnInfo, 'name' | 'displayName' | 'pii' | 'phi'> & {
  canMenu: boolean;
};

export class BulkAction {

  constructor(
    public readonly actionInfo: ActionInfo,
    public execute: () => Promise<any>,
  ) {
  }

  get name() {
    return this.actionInfo.name;
  }
  get displayName() {
    return this.actionInfo.displayName;
  }

}

export class ColumnAction {

  private readonly columnInfo: ColumnActionInfo & ColumnInfo;

  constructor(
    actionInfo: ColumnActionInfo,
    public execute: (entity: any, data?: any) => Promise<any>,
    private innerRender: (entity: any, self: ColumnAction) => JSX.Element,
  ) {
    this.columnInfo = {
      ...actionInfo,
      type: ColumnType.String,
      custom: false,
      required: false,
      updatable: false,
    };
  }

  get name() {
    return this.columnInfo.name;
  }
  get displayName() {
    return this.columnInfo.displayName;
  }

  asColumnInfo(): ColumnActionInfo & ColumnInfo {
    return this.columnInfo;
  }

  render(entity: any): JSX.Element {
    return this.innerRender(entity, this);
  }

}

type ActionRegistry = Record<EntityType, {
  columns: Record<string, ColumnAction>;
  bulk: Record<string, BulkAction>;
}>;

const actions: ActionRegistry = {
  observation: {
    columns: {},
    bulk: {},
  },
  roster: {
    columns: {},
    bulk: {},
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

export const executeAction = (action: BulkAction | ColumnAction, entity?: any, data?: any) => {
  if (action instanceof BulkAction) {
    return action.execute();
  }
  return action.execute(entity, data);
}
