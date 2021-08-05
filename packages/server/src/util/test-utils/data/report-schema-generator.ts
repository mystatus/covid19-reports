import { Org } from '../../../api/org/org.model';
import { defaultReportSchemas, ReportSchema } from '../../../api/report-schema/report-schema.model';

export function reportSchemaTestData(org: Org) {
  let reportSchemas = ReportSchema.create(defaultReportSchemas);
  reportSchemas = reportSchemas.concat(ReportSchema.create(defaultReportSchemas));
  for (let i = 0; i < reportSchemas.length; i++) {
    const report = reportSchemas[i];
    report.org = org;
    if (i > 0) {
      report.id += i.toString();
    }
  }
  return reportSchemas;
}
