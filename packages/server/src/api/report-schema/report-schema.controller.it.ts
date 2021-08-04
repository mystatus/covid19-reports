import { expect } from 'chai';
import { expectNoErrors } from '../../util/test-utils/expect';
import {
  seedOrgContactRoles,
} from '../../util/test-utils/seed';
import { TestRequest } from '../../util/test-utils/test-request';
import {
  uniqueString,
} from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { User } from '../user/user.model';
import { seedReport, seedReports } from './report-schema.model.mock';
import { defaultReportSchemas, ReportSchema } from './report-schema.model';
import { AddReportBody, UpdateReportBody } from './report-schema.controller';

describe(`Report Schema Controller`, () => {
  const basePath = '/api/report';
  let req: TestRequest;
  let org: Org;
  let contact: User;

  beforeEach(async () => {
    ({ org, contact } = await seedOrgContactRoles());
    req = new TestRequest(basePath);
    req.setUser(contact);
  });

  describe(`${basePath}/:orgId : get`, () => {
    it(`gets the org's report schemas`, async () => {
      const reports = await seedReports(org, { count: 2 });

      const res = await req.get(`/${org.id}`);

      expectNoErrors(res);
      expect(res.data).to.be.array();
      expect(res.data).to.have.lengthOf(reports.length + defaultReportSchemas.length);
      const dataIds = res.data.map((x: ReportSchema) => x.id);
      for (const defaultReport of defaultReportSchemas) {
        expect(dataIds).to.include(defaultReport.id);
      }
      expect(dataIds).to.include(reports[0].id);
      expect(dataIds).to.include(reports[1].id);
    });
  });

  describe(`${basePath}/:orgId : post`, () => {
    it(`adds a report schema to the org`, async () => {
      const reportCountBefore = await ReportSchema.count();
      const orgReportCountBefore = await ReportSchema.count({
        where: { org },
      });

      const body: AddReportBody = {
        id: uniqueString(),
        name: uniqueString(),
        columns: [{
          keyPath: [uniqueString(), uniqueString()],
          phi: false,
          pii: false,
          type: 'string',
        }],
      };

      const res = await req.post(`/${org.id}`, body);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'id',
        'name',
        'org',
        'columns',
      ]);
      const reportId = res.data.id;

      const reportAfter = (await ReportSchema.findOne({
        relations: ['org'],
        where: {
          id: reportId,
          org: org.id,
        },
      }))!;
      expect(reportAfter).to.exist;
      expect(reportAfter.name).to.eql(body.name);
      expect(reportAfter.org).to.exist;
      expect(reportAfter.org!.id).to.eql(org.id);
      expect(reportAfter.columns).to.eql(body.columns);

      expect(await ReportSchema.count()).to.eql(reportCountBefore + 1);
      const orgReportCountAfter = await ReportSchema.count({
        where: { org },
      });
      expect(orgReportCountAfter).to.eql(orgReportCountBefore + 1);
    });
  });

  describe(`${basePath}/:orgId/:reportId : put`, () => {
    it(`updates a report in an org`, async () => {
      const report = await seedReport(org);

      const body: UpdateReportBody = {
        name: uniqueString(),
        columns: [...report.columns, {
          keyPath: [uniqueString(), uniqueString()],
          phi: false,
          pii: false,
          type: 'string',
        }],
      };

      const res = await req.put(`/${org.id}/${report.id}`, body);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'id',
        'name',
        'org',
        'columns',
      ]);
      expect(res.data.id).to.eql(report.id);

      const reportAfter = (await ReportSchema.findOne({
        relations: ['org'],
        where: {
          id: report.id,
          org: org.id,
        },
      }))!;
      expect(reportAfter.name).to.eql(body.name);
      expect(reportAfter.columns).to.eql(body.columns);
    });
  });

  describe(`${basePath}/:orgId/:reportId : delete`, () => {
    it(`deletes the org's report`, async () => {
      const reports = await seedReports(org, { count: 2 });

      const reportsCountBefore = await ReportSchema.count();

      const reportBefore = await ReportSchema.findOne({
        relations: ['org'],
        where: {
          id: reports[0].id,
          org: org.id,
        },
      });
      expect(reportBefore).to.exist;

      const res = await req.delete(`/${org.id}/${reports[0].id}`);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'name',
        'columns',
      ]);

      expect(await ReportSchema.count()).to.eql(reportsCountBefore - 1);

      const reportAfter = await ReportSchema.findOne({
        relations: ['org'],
        where: {
          id: reports[0].id,
          org: org.id,
        },
      });
      expect(reportAfter).not.to.exist;
    });
  });
});
