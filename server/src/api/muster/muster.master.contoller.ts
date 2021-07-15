import { Response } from 'express';
import postgresController from './muster.postgres.controller';
import { ApiRequest, OrgRoleParams, Paginated } from '../api.router';
import { Roster } from '../roster/roster.model';
import controller, { GetMusterRosterQuery} from './muster.controller';


class MusterMasterController {

  async getMusterRoster(req: ApiRequest<OrgRoleParams, null, GetMusterRosterQuery>, res: Response<Paginated<Partial<Roster>>>) {
    if (process.env.NEW_MASTER_CONTROLLER === 'true') {
      return postgresController.getMusterRoster(req, res);
    }
    return controller.getMusterRoster(req, res);
  }
}
export default new MusterMasterController();

