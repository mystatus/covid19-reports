export interface ObservationApiModel {
  documentId: string;
  edipi: string;
  timestamp: number;
  unit: string;
  reportSchemaId: string;
  reportingGroup?: string;
  phoneNumber: string;
}
