export interface ObservationApiModel {
  documentId: string;
  edipi: string;
  timestamp: number;
  unit: string;
  typeId: string;
  reportingGroup?: string;
}
