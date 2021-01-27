import { Response } from 'express';
import { Like } from 'typeorm';
import {
  ApiRequest,
  OrgParam,
  OrgPrefixParam,
} from '../index';
import { Org } from './org.model';
import {
  BadRequestError,
  NotFoundError,
} from '../../util/error-types';
import { MusterConfiguration } from '../unit/unit.model';

class OrgController {

  async getOrgList(req: ApiRequest<Partial<OrgPrefixParam>>, res: Response) {
    if (!req.appUser.isRegistered) {
      throw new BadRequestError('User is not registered');
    }

    const orgs = await Org.find({
      relations: ['contact'],
      ...(req.params.orgPrefix && {
        where: {
          name: Like(`${req.params.orgPrefix}%`),
        },
      }),
    });

    res.json(orgs);
  }

  async getOrg(req: ApiRequest, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found');
    }

    res.json(req.appOrg);
  }

  async addOrg(req: ApiRequest<null, AddOrgBody>, res: Response) {
    if (!req.body.name) {
      throw new BadRequestError('An organization name must be supplied when adding an organization.');
    }

    if (!req.body.description) {
      throw new BadRequestError('An organization description must be supplied when adding an organization.');
    }

    const org = new Org();
    org.name = req.body.name;
    org.description = req.body.description;
    const newOrg = await org.save();

    await res.status(201).json(newOrg);
  }

  async deleteOrg(req: ApiRequest, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization could not be found.');
    }

    const removedOrg = await req.appOrg.remove();

    res.json(removedOrg);
  }

  async updateOrg(req: ApiRequest<OrgParam, UpdateOrgBody>, res: Response) {
    const name = req.body.name;
    const description = req.body.description;

    if (!req.appOrg) {
      throw new NotFoundError('Organization could not be found.');
    }

    if (name) {
      req.appOrg.name = name;
    }

    if (description) {
      req.appOrg.description = description;
    }

    const updatedOrg = await req.appOrg.save();

    res.json(updatedOrg);
  }

  async updateOrgDefaultMuster(req: ApiRequest<OrgParam, UpdateOrgDefaultMusterBody>, res: Response) {
    const defaultMusterConfiguration = req.body.defaultMusterConfiguration;

    req.appOrg!.defaultMusterConfiguration = defaultMusterConfiguration ?? [];

    const updatedOrg = await req.appOrg!.save();

    res.json(updatedOrg);
  }

}

type AddOrgBody = {
  name: string
  description: string
};

type UpdateOrgBody = AddOrgBody;

type UpdateOrgDefaultMusterBody = {
  defaultMusterConfiguration: MusterConfiguration[]
};

export default new OrgController();
