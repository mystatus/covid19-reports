import { Response } from 'express';
import { getManager } from 'typeorm';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../../util/error-types';
import { assertRequestBody } from '../../util/api-utils';
import {
  ApiRequest,
  OrgParam,
} from '../api.router';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import { User } from '../user/user.model';
import {
  AccessRequest,
  AccessRequestStatus,
} from './access-request.model';
import { Unit } from '../unit/unit.model';

class AccessRequestController {

  async getAccessRequests(req: ApiRequest, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found');
    }

    const requests = await AccessRequest.find({
      relations: ['user', 'org'],
      where: {
        org: req.appOrg.id,
        status: AccessRequestStatus.Pending,
      },
    });

    res.json(requests);
  }

  async issueAccessRequest(req: ApiRequest<OrgParam, IssueAccessRequestBody>, res: Response) {
    if (!req.appUser.isRegistered) {
      throw new BadRequestError('User is not registered');
    }

    const orgId = parseInt(req.params.orgId);
    if (Number.isNaN(orgId) || orgId < 0) {
      throw new BadRequestError(`Invalid organization id: ${orgId}`);
    }

    const { whatYouDo, sponsorName, sponsorEmail, justification, sponsorPhone } = assertRequestBody(req, [
      'whatYouDo',
      'sponsorName',
      'sponsorEmail',
      'sponsorPhone',
      'justification',
    ]);

    const org = await Org.findOne({
      where: {
        id: orgId,
      },
      relations: ['contact'],
    });

    if (!org) {
      throw new NotFoundError('Organization was not found.');
    }

    const existingRequest = await AccessRequest.findOne({
      where: {
        user: req.appUser.edipi,
        org: org.id,
      },
    });

    if (existingRequest) {
      if (existingRequest.status === AccessRequestStatus.Denied) {
        // Remove the denied request so that we can issue a new one.
        await existingRequest.remove();
      } else {
        throw new BadRequestError('The access request has already been issued.');
      }
    }

    const request = new AccessRequest();
    request.user = req.appUser;
    request.org = org;
    request.requestDate = new Date();
    request.whatYouDo = whatYouDo;
    request.sponsorName = sponsorName;
    request.sponsorEmail = sponsorEmail;
    request.sponsorPhone = sponsorPhone;
    request.justification = justification;
    await request.save();

    res.status(201).json(request);
  }

  async cancelAccessRequest(req: ApiRequest<OrgParam>, res: Response) {
    if (!req.appUser.isRegistered) {
      throw new BadRequestError('User is not registered');
    }

    const orgId = parseInt(req.params.orgId);
    if (Number.isNaN(orgId) || orgId < 0) {
      throw new BadRequestError(`Invalid organization id: ${orgId}`);
    }

    const org = await Org.findOne({
      where: {
        id: orgId,
      },
    });

    if (!org) {
      throw new NotFoundError('Organization was not found.');
    }

    const request = await AccessRequest.findOne({
      where: {
        user: req.appUser.edipi,
        org: org.id,
      },
    });

    if (!request) {
      throw new NotFoundError('Access request was not found.');
    }

    await request.remove();

    res.status(204).send();
  }

  async approveAccessRequest(req: ApiRequest<unknown, ApproveAccessRequestBody>, res: Response) {
    const orgId = req.appOrg!.id;
    const { requestId, roleId, unitIds, allUnits } = assertRequestBody(req, [
      'requestId',
      'roleId',
      'unitIds',
      'allUnits',
    ]);

    if (unitIds.length === 0 && !allUnits) {
      throw new BadRequestError('At least one unit must be set!');
    }

    const accessRequest = await AccessRequest.findOne({
      relations: ['user'],
      where: {
        id: requestId,
        org: orgId,
      },
    });

    if (!accessRequest) {
      throw new NotFoundError('Access request was not found');
    }

    const role = await Role.findOne({
      where: {
        id: roleId,
        org: orgId,
      },
    });

    if (!role) {
      throw new NotFoundError('Role was not found');
    }

    let units: Unit[] = [];
    if (!allUnits) {
      units = await Unit
        .createQueryBuilder()
        .where('org_id = :orgId', { orgId })
        .andWhere(`id IN (${unitIds.join(',')})`)
        .getMany();

      if (units.length === 0) {
        throw new NotFoundError('No matching units were found');
      }

      if (units.length < unitIds.length) {
        throw new NotFoundError('Some units could not be found.');
      }
    }

    if (!req.appUserRole || !req.appUserRole.role.isSupersetOf(role)) {
      throw new UnauthorizedError('Unable to assign a role with greater permissions than your current role.');
    }

    const user = await User.findOne({
      relations: ['userRoles', 'userRoles.role', 'userRoles.role.org'],
      where: {
        edipi: accessRequest.user!.edipi,
      },
    });

    if (!user) {
      throw new NotFoundError('User was not found');
    }

    const userRole = user.userRoles.find(ur => ur.role.org!.id === orgId);
    if (userRole?.role) {
      await accessRequest.remove();
      throw new BadRequestError('User already has a role in the organization');
    }

    let processedRequest: AccessRequest | null = null;

    await getManager().transaction(async manager => {
      await user.addRole(manager, role, units, allUnits);
      await manager.save(user);

      processedRequest = await manager.remove(accessRequest);
    });

    res.json({
      success: true,
      request: processedRequest,
    });
  }

  async denyAccessRequest(req: ApiRequest<OrgParam, AccessRequestBody>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found');
    }

    if (!req.body.requestId) {
      throw new BadRequestError('Missing access request id');
    }

    const request = await AccessRequest.findOne({
      where: {
        id: req.body.requestId,
        org: req.appOrg.id,
      },
    });

    if (!request) {
      throw new NotFoundError('Access request was not found.');
    }

    request.status = AccessRequestStatus.Denied;
    const deniedRequest = await request.save();

    res.json(deniedRequest);
  }
}

export type AccessRequestBody = {
  requestId: number,
};

export type ApproveAccessRequestBody = AccessRequestBody & {
  roleId: number,
  unitIds: number[],
  allUnits: boolean,
};

export type IssueAccessRequestBody = {
  whatYouDo: string[]
  sponsorName: string
  sponsorEmail: string
  sponsorPhone: string
  justification: string
};

export default new AccessRequestController();
