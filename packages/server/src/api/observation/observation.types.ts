export interface ObservationApiModel {
  documentId: string;
  edipi: string;
  timestamp: number;
  unit: string;
  reportSchemaId: string;
  reportingGroup?: string;
  phoneNumber: string;
}

export interface Report {
  ID: string;
  EDIPI: string;
  Timestamp: number;
  ReportingGroup?: string;
  ReportType: string;
  API: {
    ID: string;
    Resource: string;
    Stage: string;
  };
  Browser: {
    Locale: string;
    Timestamp: number;
    TimeZone: string;
    UserAgent: string;
  };
  Client?: {
    Application: string;
    Environment: string;
    GitCommit: string;
    Origin: string;
  };
  Model: {
    Version: string;
  };
  Details: {
    [key: string]: number | string | boolean | null;
  };
}
