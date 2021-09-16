import _ from 'lodash';
import { Response } from 'express';
import {
  AddUnitBody,
  GetUnitRosterQuery,
  UnitData,
  UpdateUnitBody,
} from '@covid19-reports/shared';
import { Log } from '../../util/log';
import {
  ApiRequest,
  OrgParam,
  OrgUnitParams,
} from '../api.router';
import { Unit } from './unit.model';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../../util/error-types';
import { Roster } from '../roster/roster.model';
import {
  ChangeType,
  RosterHistory,
} from '../roster/roster-history.model';

class UnitController {

  async getUnits(req: ApiRequest<OrgParam>, res: Response) {
    if (!req.appUserRole) {
      res.json([]);
      return;
    }
    res.json(_.sortBy(await req.appUserRole.getUnits(), ['id']));
  }

  async addUnit(req: ApiRequest<OrgParam, AddUnitBody>, res: Response) {
    if (!req.body.name) {
      throw new BadRequestError('A name must be supplied when adding a unit.');
    }

    const existingUnit = await Unit.findOne({
      where: {
        name: req.body.name,
        org: req.appOrg!.id,
      },
    });

    if (existingUnit) {
      throw new BadRequestError('There is already a unit with that name.');
    }

    const unit = new Unit();
    unit.org = req.appOrg;
    await setUnitFromBody(req.appOrg!.id, unit, req.body);

    const newUnit = await unit.save();
    res.status(201).json(newUnit);
  }

  async updateUnit(req: ApiRequest<OrgUnitParams, UpdateUnitBody>, res: Response) {
    const existingUnit = await req.appUserRole?.getUnit(parseInt(req.params.unitId));
    if (!existingUnit) {
      throw new NotFoundError('The unit could not be found.');
    }
    await setUnitFromBody(req.appOrg!.id, existingUnit, req.body);
    const updatedUnit: Unit = await existingUnit.save();
    res.json(updatedUnit);
  }

  async deleteUnit(req: ApiRequest<OrgUnitParams>, res: Response) {
    const existingUnit = await req.appUserRole?.getUnit(parseInt(req.params.unitId));
    if (!existingUnit) {
      throw new NotFoundError('The unit could not be found.');
    }

    const unitCount = await Roster.count({
      where: {
        unit: existingUnit.id,
      },
    });

    if (unitCount > 0) {
      throw new BadRequestError('Cannot delete a unit that has individuals assigned to it.');
    }

    const deletedUnit = await existingUnit.remove();
    res.json(deletedUnit);
  }

  async getUnitRoster(req: ApiRequest<OrgUnitParams, null, GetUnitRosterQuery>, res: Response) {
    const timestamp = parseInt(req.query.timestamp);
    const unitId = parseInt(req.params.unitId);

    const roster = await RosterHistory.createQueryBuilder('roster')
      .leftJoin('roster.unit', 'u')
      .select('roster.edipi', 'edipi')
      .addSelect('roster.change_type', 'changeType')
      .where('u.org_id = :orgId', { orgId: req.appOrg!.id })
      .andWhere('u.id = :unitId', { unitId })
      .andWhere(`roster.timestamp <= to_timestamp(:timestamp) AT TIME ZONE '+0'`, { timestamp })
      .distinctOn(['roster.edipi'])
      .orderBy('roster.edipi')
      .addOrderBy('roster.timestamp', 'DESC')
      .getRawMany() as { edipi: string; changeType: ChangeType }[];

    res.json(roster.filter(entry => entry.changeType !== ChangeType.Deleted).map(entry => entry.edipi));
  }

}

function setUnitFromBody(orgId: number, unit: Unit, body: UnitData) {
  if (body.name) {
    unit.name = body.name;
  }
}

export default new UnitController();
