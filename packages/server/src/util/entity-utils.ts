import {
  ColumnInfo,
  ColumnType,
  ColumnValue,
  FilterConfig,
  FilterConfigItem,
  findColumnByFullyQualifiedName,
  formatColumnSelect,
  getFullyQualifiedColumnName,
  GetEntitiesQuery,
  Paginated,
  QueryOp, GetAllowedColumnsQuery,
} from '@covid19-reports/shared';
import bodyParser from 'body-parser';
import { Response } from 'express';
import moment from 'moment';
import {
  OrderByCondition,
  SelectQueryBuilder,
} from 'typeorm';
import {
  ApiRequest,
  OrgParam,
} from '../api/api.router';
import { Org } from '../api/org/org.model';
import { Role } from '../api/role/role.model';
import { UserRole } from '../api/user/user-role.model';
import { requireOrgAccess } from '../auth/auth-middleware';
import { BadRequestError } from './error-types';

export interface IEntity {
}

export interface IEntityModel<T extends IEntity> {
  new(): T;
  getColumnSelect(column: ColumnInfo): string;
  getColumnWhere(column: ColumnInfo): string;
  filterAllowedColumns?(columns: ColumnInfo[], role: Role): ColumnInfo[];
  getColumns(org: Org, includeRelationships?: boolean, version?: string): Promise<ColumnInfo[]>;
  buildSearchQuery(org: Org, userRole: UserRole, columns: ColumnInfo[]): Promise<SelectQueryBuilder<T>>;
}

export function MakeEntity<T, S extends IEntityModel<T>>() {
  return <U extends S>(constructor: U) => {
    return constructor;
  };
}
export class EntityService<T extends IEntity> {

  constructor(private entity: IEntityModel<T>) {}

  getColumnSelect(column: ColumnInfo) {
    return this.entity.getColumnSelect(column);
  }

  getColumnWhere(column: ColumnInfo) {
    return this.entity.getColumnWhere(column);
  }

  getColumns(org: Org, includeRelationships?: boolean, version?: string): Promise<ColumnInfo[]> {
    return this.entity.getColumns(org, includeRelationships, version);
  }

  filterAllowedColumns(columns: ColumnInfo[], role: Role) {
    if (this.entity.filterAllowedColumns) {
      return this.entity.filterAllowedColumns(columns, role);
    }
    return columns.filter(column => isColumnAllowed(column, role));
  }

  async getEntities<R = T>(query: GetEntitiesQuery, org: Org, userRole: UserRole): Promise<Paginated<R>> {
    const limit = parseInt(query.limit ?? '10');
    const page = parseInt(query.page ?? '0');
    const orderBy = query.orderBy || 'edipi';
    const sortDirection = query.sortDirection || 'ASC';
    const filterConfig = query.filterConfig || {};
    const columns = await this.getColumns(org, true, 'es6ddssymptomobs');
    const allowedColumns = this.filterAllowedColumns(columns, userRole.role);
    let queryBuilder = await this.entity.buildSearchQuery(org, userRole, allowedColumns);

    Object.keys(filterConfig)
      .forEach(columnName => {
        const column = findColumnByFullyQualifiedName(columnName, allowedColumns);
        if (!column) {
          throw new BadRequestError(`Malformed search query. Unknown column: '${columnName}'.`);
        }

        // check for expressions
        const colFilter = filterConfig[columnName];
        if (colFilter.expressionEnabled && colFilter.expression) {
          if (column.type === ColumnType.Date || column.type === ColumnType.DateTime) {
            if (colFilter.expressionRef) {
              const refColumn = findColumnByFullyQualifiedName(colFilter.expressionRef, allowedColumns);
              if (!refColumn) {
                throw new Error(`Malformed expression. Unknown column path: '${colFilter.expressionRef}'.`);
              }

              colFilter.expressionRef = formatColumnSelect(this.getColumnSelect(refColumn), refColumn);
              const expressionVal = parseInt(colFilter.expression);
              const sign = expressionVal < 0 ? '-' : '+';
              colFilter.expressionRef = `${colFilter.expressionRef} ${sign} interval'${Math.abs(expressionVal)} days'`;
            } else {
              colFilter.value = moment().startOf('day').add({ days: parseInt(colFilter.expression) }).toISOString();
            }
          } else if (column.type === ColumnType.Number) {
            // Placeholder for numeric expressions if desired in the future...
          }
        }
        queryBuilder = this.applyWhere(queryBuilder, column, colFilter);
      });

    const pagedQuery = queryBuilder
      .clone();
    if (limit > 0) {
      pagedQuery
        .offset(page * limit)
        .limit(limit);
    }

    const sortColumn = allowedColumns.find(column => column.name === orderBy);
    if (sortColumn) {
      const order: OrderByCondition = {};
      if (sortColumn.table && sortColumn.hasOwnProperty('sql')) {
        order[getFullyQualifiedColumnName(sortColumn)] = sortDirection;
      } else {
        order[this.entity.getColumnSelect(sortColumn)] = sortDirection;
      }
      pagedQuery.orderBy(order);
    } else if (orderBy === 'unit') {
      const order: OrderByCondition = {};
      order['u.name'] = sortDirection;
      pagedQuery.orderBy(order);
    }

    const [rows, totalRowsCount] = await Promise.all([pagedQuery.getRawMany<R>(), queryBuilder.getCount()]);

    return {
      rows,
      totalRowsCount,
    };
  }

  applyWhere(queryBuilder: SelectQueryBuilder<T>, column: ColumnInfo, filterItem: FilterConfigItem) {
    const method = this.where[filterItem.op];
    if (method) {
      return method.call(this, queryBuilder, column, filterItem);
    }
    throw new BadRequestError(`Malformed search query. Received unexpected parameters for '${getFullyQualifiedColumnName(column)}', op: ${filterItem.op}`);
  }

  where: Record<QueryOp, (queryBuilder: SelectQueryBuilder<T>, column: ColumnInfo, filterConfigItem: FilterConfigItem) => SelectQueryBuilder<T>> = {
    in: this.whereIn,
    between: this.whereBetween,
    '~': this.whereLike,
    startsWith: this.whereLike,
    endsWith: this.whereLike,
    '=': this.whereCompare,
    '<>': this.whereCompare,
    '>': this.whereCompare,
    '<': this.whereCompare,
    null: this.whereNull,
    notnull: this.whereNull,
  };

  whereIn(queryBuilder: SelectQueryBuilder<T>, column: ColumnInfo, filterConfigItem: FilterConfigItem) {
    const { op, value } = filterConfigItem;

    if (!Array.isArray(value)) {
      throw new BadRequestError(`Malformed search query. Expected array value for ${getFullyQualifiedColumnName(column)}.`);
    }
    const columnSelect = formatColumnSelect(this.getColumnWhere(column), column);
    return queryBuilder.andWhere(`${columnSelect} ${op} (:...${column.name})`, {
      [column.name]: value.map(v => formatColumnValue(v, column)),
    });
  }

  whereBetween(queryBuilder: SelectQueryBuilder<T>, column: ColumnInfo, filterConfigItem: FilterConfigItem) {
    const { value } = filterConfigItem;

    const maxKey = `${column.name}Max`;
    const minKey = `${column.name}Min`;
    if (!Array.isArray(value)) {
      throw new BadRequestError(`Malformed search query. Expected array value for ${getFullyQualifiedColumnName(column)}.`);
    }
    const columnSelect = formatColumnSelect(this.getColumnWhere(column), column);
    return queryBuilder.andWhere(`${columnSelect} BETWEEN (:${minKey}) AND (:${maxKey})`, {
      [minKey]: formatColumnValue(value[0], column),
      [maxKey]: formatColumnValue(value[1], column),
    });
  }

  whereLike(queryBuilder: SelectQueryBuilder<T>, column: ColumnInfo, filterConfigItem: FilterConfigItem) {
    const { op, value } = filterConfigItem;

    if (column.type !== ColumnType.String) {
      throw new BadRequestError('Malformed search query. Expected string value.');
    }
    const prefix = op !== 'startsWith' ? '%' : '';
    const suffix = op !== 'endsWith' ? '%' : '';
    const columnSelect = formatColumnSelect(this.getColumnWhere(column), column);
    return queryBuilder.andWhere(`${columnSelect} LIKE :${column.name}`, {
      [column.name]: `${prefix}${value}${suffix}`.toLowerCase(),
    });
  }

  whereCompare(queryBuilder: SelectQueryBuilder<T>, column: ColumnInfo, filterConfigItem: FilterConfigItem) {
    const { op, value, expressionRef } = filterConfigItem;

    if (Array.isArray(value)) {
      throw new BadRequestError(`Malformed search query. Expected scalar value for ${column.name}.`);
    }
    const columnSelect = formatColumnSelect(this.getColumnWhere(column), column);
    if (expressionRef) {
      return queryBuilder.andWhere(`${columnSelect} ${op} ${expressionRef}`);
    }

    return queryBuilder.andWhere(`${columnSelect} ${op} :${column.name}`, {
      [column.name]: formatColumnValue(value, column),
    });
  }

  whereNull(queryBuilder: SelectQueryBuilder<T>, column: ColumnInfo, filterConfigItem: FilterConfigItem) {
    const { op } = filterConfigItem;
    const columnSelect = formatColumnSelect(this.getColumnWhere(column), column);
    const nullOrNot = op === 'null' ? 'NULL' : 'NOT NULL';
    return queryBuilder.andWhere(`${columnSelect} IS ${nullOrNot}`);
  }

}

export type AllowedColumnsParam = OrgParam & {
  version?: string;
};

export type EntityRouteOptions = {
  hasVersionedColumns?: boolean;
};

export const defaultEntityRouteOptions: EntityRouteOptions = {
  hasVersionedColumns: false,
};

export class EntityController<T = any> {

  protected service: EntityService<T>;

  constructor(protected entityConstructor: IEntityModel<T>) {
    this.service = new EntityService(entityConstructor);
  }

  getAllowedColumns = async (req: ApiRequest<AllowedColumnsParam, null, GetAllowedColumnsQuery>, res: Response<ColumnInfo[]>) => {
    const includeRelationships = req.query.includeRelationships !== 'false'; // undefined should default to true
    const columns = this.service.filterAllowedColumns(await this.entityConstructor.getColumns(req.appOrg!, includeRelationships, req.params.version), req.appUserRole!.role);
    res.json(columns);
  };

  getEntities = async (req: ApiRequest<OrgParam, FilterConfig | null, GetEntitiesQuery>, res: Response<Paginated<T>>) => {
    res.json(await this.service.getEntities(req.query, req.appOrg!, req.appUserRole!));
  };

  registerEntityRoutes = (router: any, { hasVersionedColumns }: EntityRouteOptions, ...middleware: any[]) => {
    router.get(
      `/:orgId/allowed-column${hasVersionedColumns ? '/:version' : ''}`,
      requireOrgAccess,
      ...middleware,
      this.getAllowedColumns,
    );

    router.get(
      '/:orgId',
      requireOrgAccess,
      ...middleware,
      this.getEntities,
    );

    router.post(
      '/:orgId',
      requireOrgAccess,
      ...middleware,
      bodyParser.json(),
      this.getEntities,
    );
  };

}

function formatColumnValue(val: ColumnValue, column: ColumnInfo) {
  if (val === null) {
    return val;
  }
  switch (column.type) {
    case ColumnType.String:
      return val.toString().toLowerCase();
    case ColumnType.DateTime:
      return `'${moment.utc(val.toString()).format('YYYY-MM-DD HH:mm')}:00.000000'`;
    case ColumnType.Date:
      return `'${moment.utc(val.toString()).format('YYYY-MM-DD')} 00:00:00.000000'`;
    default:
      return val;
  }
}

export function isColumnAllowed(column: ColumnInfo, role: Role) {
  return ((!column.pii || role.canViewPII) && (!column.phi || role.canViewPHI));
}
