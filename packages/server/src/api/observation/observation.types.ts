export interface ObservationApiModel {
  documentId: string;
  edipi: string;
  timestamp: number;
  unit: string;
  reportSchemaId: string;
  reportingGroup?: string;
  phoneNumber: string;
}

export interface ObservationApiRawReportModel {
  ID: string;
  EDIPI: string;
  Timestamp: number;
  ReportingGroup?: string;
  ReportType: string;
  Client?: {
    Application?: string;
  };
  Details?: {
    PhoneNumber?: string;
    Unit?: string;
  };
}
