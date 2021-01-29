import { Response } from 'express';
import {
  ApiRequest, OrgParam, OrgUnitParams,
} from '../index';
import { MusterConfiguration, Unit } from './unit.model';
import {
  BadRequestError, InternalServerError, NotFoundError,
} from '../../util/error-types';
import { Roster } from '../roster/roster.model';
import { matchWildcardString, sanitizeIndexPrefix } from '../../util/util';
import elasticsearch from '../../elasticsearch/elasticsearch';
import { ChangeType, RosterHistory } from '../roster/roster-history.model';

class UnitController {

  async getUnits(req: ApiRequest<OrgParam>, res: Response) {
    if (!req.appUserRole?.indexPrefix) {
      res.json([]);
      return;
    }
    const units = await Unit
      .createQueryBuilder('unit')
      .leftJoinAndSelect('unit.org', 'org')
      .where('unit.org_id=:orgId', { orgId: req.appOrg!.id })
      .andWhere('unit.id like :unitFilter', {
        unitFilter: req.appUserRole!.indexPrefix.replace('*', '%'),
      })
      .orderBy('unit.id', 'ASC')
      .getMany();

    res.json(units);
  }

  async addUnit(req: ApiRequest<OrgParam, UnitData>, res: Response) {
    if (!req.body.id) {
      throw new BadRequestError('An ID must be supplied when adding a unit.');
    }
    if (!matchWildcardString(req.body.id, req.appUserRole!.indexPrefix)) {
      throw new BadRequestError('The provided unit ID does not conform to the unit filter for your role.');
    }
    if (!req.body.name) {
      throw new BadRequestError('A name must be supplied when adding a unit.');
    }

    if (req.body.id !== sanitizeIndexPrefix(req.body.id)) {
      throw new BadRequestError('Only lowercase letters, numbers, and underscores are allowed in the unit ID.');
    }

    const existingUnit = await Unit.findOne({
      where: {
        id: req.body.id,
        org: req.appOrg!.id,
      },
    });

    if (existingUnit) {
      throw new BadRequestError('There is already a unit with that ID.');
    }

    const unit = new Unit();
    unit.org = req.appOrg;
    setUnitFromBody(unit, req.body);

    const newUnit = await unit.save();
    res.status(201).json(newUnit);
  }

  async updateUnit(req: ApiRequest<OrgUnitParams, UnitData>, res: Response) {
    if (!matchWildcardString(req.params.unitId, req.appUserRole!.indexPrefix)) {
      // If they don't have permission to see the unit, treat it as not found
      throw new NotFoundError('The unit could not be found.');
    }
    const existingUnit = await Unit.findOne({
      relations: ['org'],
      where: {
        id: req.params.unitId,
        org: req.appOrg!.id,
      },
    });

    if (!existingUnit) {
      throw new NotFoundError('The unit could not be found.');
    }

    if (req.body.id && req.body.id !== existingUnit.id) {
      throw new BadRequestError('Unable to change the ID of a unit.');
    }

    const rename = req.body.name && (req.body.name !== existingUnit.name);

    setUnitFromBody(existingUnit, req.body);
    const updatedUnit: Unit = await existingUnit.save();

    // Rename elasticsearch documents
    if (rename) {
      try {
        await elasticsearch.updateByQuery({
          index: `${req.appOrg!.indexPrefix}-${req.params.unitId}-*`,
          type: '_doc',
          body: {
            script: {
              source: `ctx._source.Roster.unit = '${updatedUnit.name}'`,
              lang: 'painless',
            },
          },
        });
      } catch (err) {
        console.log(err);
        throw new InternalServerError('Unit was updated, but there was an error updating elasticsearch documents.');
      }
    }

    res.json(updatedUnit);
  }

  async deleteUnit(req: ApiRequest<OrgUnitParams>, res: Response) {
    if (!matchWildcardString(req.params.unitId, req.appUserRole!.indexPrefix)) {
      // If they don't have permission to see the unit, treat it as not found
      throw new NotFoundError('The unit could not be found.');
    }
    const existingUnit = await Unit.findOne({
      relations: ['org'],
      where: {
        id: req.params.unitId,
        org: req.appOrg!.id,
      },
    });

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

    const roster = await RosterHistory.createQueryBuilder('roster')
      .leftJoin('roster.unit', 'u')
      .select('roster.edipi', 'edipi')
      .addSelect('roster.change_type', 'changeType')
      .where('u.org_id = :orgId', { orgId: req.appOrg!.id })
      .andWhere('u.id = :unitId', { unitId: req.params.unitId })
      .andWhere('roster.timestamp <= to_timestamp(:timestamp)', { timestamp })
      .distinctOn(['roster.edipi'])
      .orderBy('roster.edipi')
      .addOrderBy('roster.timestamp', 'DESC')
      .getRawMany() as { edipi: string, changeType: ChangeType }[];

    res.json(roster.filter(entry => entry.changeType !== ChangeType.Deleted).map(entry => entry.edipi));
  }
}


function setUnitFromBody(unit: Unit, body: UnitData) {
  if (body.name) {
    unit.name = body.name;
  }
  if (body.id) {
    unit.id = body.id;
  }
  if (body.musterConfiguration !== undefined) {
    unit.musterConfiguration = body.musterConfiguration;
  }
}


export interface UnitData {
  id?: string,
  name?: string,
  musterConfiguration?: MusterConfiguration[],
}

type GetUnitRosterQuery = {
  timestamp: string
};

export default new UnitController();
