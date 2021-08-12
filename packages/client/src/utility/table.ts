import { ColumnInfo } from '@covid19-reports/shared';

export function getNewPageIndex(rowsPerPage: number, pageIndex: number, rowsPerPageNew: number) {
  return Math.floor((pageIndex * rowsPerPage) / rowsPerPageNew);
}

export function getMaxPageIndex(rowsPerPage: number, totalRowsCount: number) {
  return Math.floor(Math.max(0, totalRowsCount - 1) / rowsPerPage);
}

export function columnInfosOrdered(columnInfos: ColumnInfo[], columnOrder: string[]) {
  const columnOrderIndices = columnOrder.reduce((acc, value, index) => {
    acc[value] = index;
    return acc;
  }, {} as {[name: string]: number});

  return columnInfos
    .filter(info => columnOrderIndices[info.name] != null)
    .sort((a, b) => columnOrderIndices[a.name] - columnOrderIndices[b.name]);
}
