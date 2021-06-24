import { Request, Response } from 'express';
import { Observation } from './observation.model';
import { ReportSchema } from '../report-schema/report-schema.model';
import { NotFoundError } from '../../util/error-types';
import { Org } from '../org/org.model';

class ObservationCreateController {
  async createObservation(req: Request, res: Response) {
    return res.json(await (toObservation(req, await toType(req, await toOrg(req))).save()));
  }
}

async function toOrg(req: Request) {
  const id = req.body.type_org;
  const org = await Org.findOne(id);

  if (!org) {
    throw new NotFoundError(`Org not found for id ${id}`);
  }

  return org;
}

async function toType(req: Request, org: Org) {
  const id = req.body.type_id;
  const type = await ReportSchema.findOne({ where: { id, org } });

  if (!type) {
    throw new NotFoundError(`ReportSchema not found for id ${id} and org_id ${org.id}`);
  }

  return type;
}

function toObservation(req: Request, type: ReportSchema) {

  const observation = new Observation();
  observation.documentId = req.body.documentId;
  observation.edipi = req.body.edipi;
  observation.timestamp = req.body.timestamp;
  observation.unitId = req.body.unitId;
  observation.unit = req.body.unit;
  observation.type = type;

  return observation;
}


export default new ObservationCreateController();
