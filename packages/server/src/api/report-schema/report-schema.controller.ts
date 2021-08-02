import { Response } from 'express';
import { ApiRequest, OrgParam, OrgReportParams } from '../api.router';
import { BadRequestError, NotFoundError } from '../../util/error-types';
import { ReportSchema, SchemaColumn } from './report-schema.model';
import { Log } from '../../util/log';

class ReportSchemaController {

  async getOrgReports(req: ApiRequest, res: Response) {
    const reports = await ReportSchema.find({
      relations: ['org'],
      where: {
        org: req.appOrg!.id,
      },
      order: {
        id: 'ASC',
      },
    });

    res.json(reports);
  }

  async addReport(req: ApiRequest<OrgParam, AddReportBody>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    if (!req.body.id) {
      throw new BadRequestError('An ID must be supplied when adding a report type.');
    }

    if (!req.body.name) {
      throw new BadRequestError('A name must be supplied when adding a report type.');
    }

    if (!req.body.columns) {
      throw new BadRequestError('A schema must be supplied when adding a report type.');
    }

    const report = new ReportSchema();
    report.id = req.body.id;
    report.org = req.appOrg;
    report.name = req.body.name;
    report.columns = req.body.columns;

    const newReport = await report.save();

    res.status(201).json(newReport);
  }

  async getReport(req: ApiRequest<OrgReportParams>, res: Response) {
    res.json(await ReportSchemaController.findReport(req));
  }

  async deleteReport(req: ApiRequest<OrgReportParams>, res: Response) {
    const report = await ReportSchemaController.findReport(req);
    const removedReport = await report.remove();
    res.json(removedReport);
  }

  async updateReport(req: ApiRequest<OrgReportParams, UpdateReportBody>, res: Response) {
    const report = await ReportSchemaController.findReport(req);

    if (req.body.name != null) {
      report.name = req.body.name;
    }

    if (req.body.columns != null) {
      report.columns = req.body.columns;
    }

    const updatedReport = await report.save();

    res.json(updatedReport);
  }

  private static async findReport(req: ApiRequest<OrgReportParams>) {
    const id = req.params.reportId;
    const org = req.appOrg!.id;
    const report = await ReportSchema.findOne({ relations: ['org'], where: { id, org } });

    if (!report) {
      Log.error(`report_schema table is missing a record for ID ${id} and org ID ${org} `);
      throw new NotFoundError('Report could not be found.');
    }
    return report;
  }

}

export type AddReportBody = {
  id: string;
  name: string;
  columns: SchemaColumn[];
};

export type UpdateReportBody = Partial<AddReportBody>;

export default new ReportSchemaController();
