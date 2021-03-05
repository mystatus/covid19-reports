import { uniqueString } from '../../util/test-utils/unique';
import { User } from '../user/user.model';
import { Org } from './org.model';
import { defaultReportSchemas, ReportSchema } from '../report-schema/report-schema.model';

export function mockOrg(contact: User) {
  return Org.create({
    name: uniqueString(),
    description: uniqueString(),
    contact,
    indexPrefix: uniqueString(),
    defaultMusterConfiguration: [],
  });
}

export async function seedOrg(contact: User) {
  const org = await mockOrg(contact).save();
  const reports = ReportSchema.create(defaultReportSchemas);
  for (const report of reports) {
    report.org = org;
  }
  await ReportSchema.save(reports);
  return org;
}
