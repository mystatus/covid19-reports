export function getNewPageIndex(rowsPerPage: number, pageIndex: number, rowsPerPageNew: number) {
  return Math.floor((pageIndex * rowsPerPage) / rowsPerPageNew);
}
