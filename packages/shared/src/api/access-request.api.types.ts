export type AccessRequestBody = {
  requestId: number;
};

export type ApproveAccessRequestBody = AccessRequestBody & {
  roleId: number;
  unitIds: number[];
  allUnits: boolean;
};

export type IssueAccessRequestBody = {
  whatYouDo: string[];
  sponsorName: string;
  sponsorEmail: string;
  sponsorPhone: string;
  justification: string;
};

export type DenyAccessRequestBody = AccessRequestBody;

