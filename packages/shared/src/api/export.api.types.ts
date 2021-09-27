export type ExportOrgQuery = {
  startDate?: string;
  endDate?: string;
};

export type ExportMusterIndividualsQuery = {
  fromDate: string;
  toDate: string;
  filterId?: string;
  reportId: string;
};
