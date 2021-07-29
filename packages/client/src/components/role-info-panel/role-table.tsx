import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableProps,
  TableRow,
  TableRowProps,
} from '@material-ui/core';
import clsx from 'clsx';
import useStyles from './role-table.styles';

export const RoleTableRow = (props: TableRowProps & { text: string }) => {
  const { iconCell, textCell } = useStyles();
  const {
    children, className, text, ...rest
  } = props;

  return (
    <TableRow {...rest}>
      <TableCell className={textCell}>
        {text}
      </TableCell>
      <TableCell className={iconCell}>
        {children}
      </TableCell>
    </TableRow>
  );
};

export const RoleTable = (props: TableProps) => {
  const { roleTable, tableScroll } = useStyles();
  const { children, className, ...rest } = props;

  return (
    <div className={tableScroll}>
      <Table {...rest} className={clsx(roleTable, className)}>
        <TableBody>
          {children}
        </TableBody>
      </Table>
    </div>
  );
};

export interface RoleDataTableProps<T> extends TableProps {
  data: T[];
  extractLabel: ((row: T) => string) | keyof Record<keyof T, string>;
  extractValue: ((row: T) => React.ReactNode);
}

export const RoleDataTable = <T extends { [P in keyof T]: unknown }>({
  data, extractLabel, extractValue, ...rest
}: RoleDataTableProps<T>) => {
  const getLabel = typeof extractLabel === 'function' ? extractLabel : ((row: T) => row[extractLabel] as string);

  return (
    <RoleTable {...rest}>
      {data.map((row: T) => {
        const label = getLabel(row);
        return (
          <RoleTableRow key={label} text={label}>
            {extractValue(row)}
          </RoleTableRow>
        );
      })}
    </RoleTable>
  );
};
