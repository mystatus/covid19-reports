import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { ReportSchema } from './report-schema.model';

export function mockReport(org: Org) {
  return ReportSchema.create({
    id: uniqueString(),
    name: uniqueString(),
    columns: [{
      keyPath: [uniqueString(), uniqueString()],
      phi: false,
      pii: false,
    }],
    org,
  });
}

export function seedReport(org: Org) {
  return mockReport(org).save();
}

export function seedReports(org: Org, options: {
  count: number
}) {
  const { count } = options;
  const reports = [] as ReportSchema[];

  for (let i = 0; i < count; i++) {
    reports.push(mockReport(org));
  }

  return ReportSchema.save(reports);
}
