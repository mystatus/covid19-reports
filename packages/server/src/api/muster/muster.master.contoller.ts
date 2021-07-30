import { Response } from 'express';
import { GetMusterRosterQuery, Paginated } from '@covid19-reports/shared';
import postgresController from './muster.postgres.controller';
import { ApiRequest, OrgRoleParams } from '../api.router';
import { Roster } from '../roster/roster.model';
import controller from './muster.controller';


class MusterMasterController {

  async getMusterRoster(req: ApiRequest<OrgRoleParams, null, GetMusterRosterQuery>, res: Response<Paginated<Partial<Roster>>>) {
    if (process.env.NEW_MASTER_CONTROLLER === 'true') {
      return await postgresController.getUserMusterCompliance(req, res);
    }
    return await controller.getMusterRoster(req, res);
  }

}
export default new MusterMasterController();

