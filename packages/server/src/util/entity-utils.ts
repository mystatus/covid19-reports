import { ColumnInfo, ColumnType, ColumnValue, edipiColumnDisplayName, Paginated, PaginationParams, QueryOp, SearchBody, SearchBodyEntry } from "@covid19-reports/shared";
import { snakeCase } from "lodash";
import moment from "moment";
import { OrderByCondition, SelectQueryBuilder } from "typeorm";
import { Org } from "../api/org/org.model";
import { Role } from "../api/role/role.model";
import { UserRole } from "../api/user/user-role.model";
import { BadRequestError } from "./error-types";

const join = (...args: Array<string | null | undefined>) => args.filter(Boolean).join('.')

export interface IEntityInstance {}

export interface IEntity<T extends IEntityInstance> {
  new(): T;
  getColumnSelect(column: ColumnInfo): string;
  filterAllowedColumns?(columns: ColumnInfo[], role: Role): ColumnInfo[];

  getColumns(org: Org, version?: string): Promise<ColumnInfo[]>;
  search(org: Org, userRole: UserRole, columns: ColumnInfo[]): Promise<SelectQueryBuilder<T>>
}

export function MakeEntity<T, S extends IEntity<T>>() {
  return <U extends S>(constructor: U) => {
    return constructor;
  };
}

export function getColumnSelect(column: ColumnInfo, customColumn: string, alias: string) {
  // Make sure custom columns are converted to appropriate types
  if (column.custom) {
    const select = `${join(alias, customColumn)} ->> '${column.name}'`;

    switch (column.type) {
      case ColumnType.Boolean:
        return `(${select})::BOOLEAN`;
      case ColumnType.Number:
        return `(${select})::DOUBLE PRECISION`;
      default:
        return select;
    }
  }
  return join(alias, snakeCase(column.name));
}

export const isColumnAllowed = (column: ColumnInfo, role: Role) => {
  return ((!column.pii || role.canViewPII) && (!column.phi || role.canViewPHI));
}

export const filterAllowedColumns = (columns: ColumnInfo[], role: Role) =>
  columns.filter(column => isColumnAllowed(column, role));


export function columnTypeToDataType(columnType: ColumnType) {
  // Get dates and enums as strings.
  switch (columnType) {
    case ColumnType.Date:
    case ColumnType.DateTime:
    case ColumnType.Enum:
      return 'string';
    default:
      return columnType;
  }
}

export const isEdipiColumn = (column: ColumnInfo) => column.displayName === edipiColumnDisplayName;


const formatValue = (val: ColumnValue, column: ColumnInfo) => {
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
};

function formatColumnSelect(columnSelect: string, column: ColumnInfo) {
  switch (column.type) {
    case ColumnType.String:
      return `LOWER(${columnSelect})`;
    case ColumnType.DateTime:
      return `date_trunc('minute', (${columnSelect})::TIMESTAMP)`;
    case ColumnType.Date:
      return `date_trunc('day', (${columnSelect})::TIMESTAMP)`;
    default:
      return columnSelect;
  }
}

function findColumnByName(name: string, columns: ColumnInfo[]): ColumnInfo {
  if (name === 'unit') {
    return {
      name: 'unit',
      displayName: 'Unit',
      custom: false,
      phi: false,
      pii: false,
      type: ColumnType.Number,
      updatable: false,
      required: false,
    };
  }
  const column = columns.find(col => col.name === name);
  if (!column) {
    throw new BadRequestError(`Malformed search query. Unknown column name: '${name}'.`);
  }
  return column;
}

export class EntityService<T extends IEntityInstance> {
  constructor(private entity: IEntity<T>) {}

  getColumnSelect(column: ColumnInfo) {
    return this.entity.getColumnSelect(column);
  }

  getColumns(org: Org, version: string): Promise<ColumnInfo[]> {
    return this.entity.getColumns(org, version);
  }

  filterAllowedColumns(columns: ColumnInfo[], role: Role) {
    if (this.entity.filterAllowedColumns) {
      return this.entity.filterAllowedColumns(columns, role);
    }
    return filterAllowedColumns(columns, role);
  }

  async search<R = T>(query: PaginationParams, org: Org, userRole: UserRole, searchParams?: SearchBody): Promise<Paginated<R>> {
    const limit = parseInt(query.limit ?? '100');
    const page = parseInt(query.page ?? '0');
    const orderBy = query.orderBy || 'edipi';
    const sortDirection = query.sortDirection || 'ASC';
    const columns = await this.entity.getColumns(org, 'es6ddssymptomobs');
    const allowedColumns = this.filterAllowedColumns(columns, userRole.role);
    let queryBuilder = await this.entity.search(org, userRole, allowedColumns);

    if (searchParams) {
      Object.keys(searchParams)
        .forEach(columnName => {
          queryBuilder = this.applyWhere(queryBuilder, findColumnByName(columnName, allowedColumns), searchParams[columnName]);
        });
    }

    const pagedQuery = queryBuilder
      .clone()
      .offset(page * limit)
      .limit(limit);

    const sortColumn = allowedColumns.find(column => column.name === orderBy);
    if (sortColumn) {
      const order: OrderByCondition = {};
      order[this.entity.getColumnSelect(sortColumn)] = sortDirection;
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

  private applyWhere(queryBuilder: SelectQueryBuilder<T>, column: ColumnInfo, body: SearchBodyEntry) {
    const method = this.where[body.op]
    if (method) {
      return method.call(this, queryBuilder, column, body)
    }
    throw new BadRequestError(`Malformed search query. Received unexpected parameters for '${column.name}', op: ${body.op}`);
  }

  where: Record<QueryOp, (queryBuilder: SelectQueryBuilder<T>, column: ColumnInfo, body: SearchBodyEntry) => SelectQueryBuilder<T>> = {
    in: this.whereIn,
    between: this.whereBetween,
    '~': this.whereLike,
    startsWith: this.whereLike,
    endsWith: this.whereLike,
    '=': this.whereCompare,
    '<>': this.whereCompare,
    '>': this.whereCompare,
    '<': this.whereCompare,
  }

  whereIn(queryBuilder: SelectQueryBuilder<T>, column: ColumnInfo, {
    op,
    value,
  }: SearchBodyEntry) {
    if (!Array.isArray(value)) {
      throw new BadRequestError(`Malformed search query. Expected array value for ${column.name}.`);
    }
    const columnSelect = formatColumnSelect(this.getColumnSelect(column), column);
    return queryBuilder.andWhere(`${columnSelect} ${op} (:...${column.name})`, {
      [column.name]: value.map(v => formatValue(v, column)),
    });
  }

  whereBetween(queryBuilder: SelectQueryBuilder<T>, column: ColumnInfo, {
    value,
  }: SearchBodyEntry) {
    const maxKey = `${column.name}Max`;
    const minKey = `${column.name}Min`;
    if (!Array.isArray(value)) {
      throw new BadRequestError(`Malformed search query. Expected array value for ${column.name}.`);
    }
    const columnSelect = formatColumnSelect(this.getColumnSelect(column), column);
    return queryBuilder.andWhere(`${columnSelect} BETWEEN (:${minKey}) AND (:${maxKey})`, {
      [minKey]: formatValue(value[0], column),
      [maxKey]: formatValue(value[1], column),
    });
  }

  whereLike(queryBuilder: SelectQueryBuilder<T>, column: ColumnInfo, {
    op,
    value,
  }: SearchBodyEntry) {
    if (column.type !== ColumnType.String) {
      throw new BadRequestError('Malformed search query. Expected string value.');
    }
    const prefix = op !== 'startsWith' ? '%' : '';
    const suffix = op !== 'endsWith' ? '%' : '';
    const columnSelect = formatColumnSelect(this.getColumnSelect(column), column);
    return queryBuilder.andWhere(`${columnSelect} LIKE :${column.name}`, {
      [column.name]: `${prefix}${value}${suffix}`.toLowerCase(),
    });
  }

  whereCompare(queryBuilder: SelectQueryBuilder<T>, column: ColumnInfo, {
    op,
    value,
  }: SearchBodyEntry) {
    if (Array.isArray(value)) {
      throw new BadRequestError(`Malformed search query. Expected scalar value for ${column.name}.`);
    }
    const columnSelect = formatColumnSelect(this.getColumnSelect(column), column);
    return queryBuilder.andWhere(`${columnSelect} ${op} :${column.name}`, {
      [column.name]: formatValue(value, column),
    });
  }
}
