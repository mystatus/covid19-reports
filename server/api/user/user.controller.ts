import { Response } from 'express';
import { getManager } from 'typeorm';
import { AccessRequest } from '../access-request/access-request.model';
import { ApiRequest, OrgEdipiParams, OrgParam } from '../index';
import { User } from './user.model';
import { Role } from '../role/role.model';
import { BadRequestError, NotFoundError } from '../../util/error-types';
import { Unit } from '../unit/unit.model';

class UserController {

  async current(req: ApiRequest, res: Response) {
    res.json(req.appUser);
  }

  async registerUser(req: ApiRequest<null, RegisterUserBody>, res: Response) {
    if (req.appUser.isRegistered) {
      throw new BadRequestError('User is already registered.');
    }

    if (!req.body.firstName) {
      throw new BadRequestError('A first name must be supplied when registering.');
    }
    if (!req.body.lastName) {
      throw new BadRequestError('A last name must be supplied when registering.');
    }
    if (!req.body.phone) {
      throw new BadRequestError('A phone number must be supplied when registering.');
    }
    if (!req.body.email) {
      throw new BadRequestError('An email address must be supplied when registering.');
    }
    if (!req.body.service) {
      throw new BadRequestError('A service must be supplied when registering.');
    }

    let user = await User.findOne({
      where: {
        edipi: req.appUser.edipi,
      },
    });

    if (user && user.isRegistered) {
      throw new BadRequestError('User is already registered.');
    } else {
      user = req.appUser;
    }
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.phone = req.body.phone;
    user.email = req.body.email;
    user.service = req.body.service;
    user.isRegistered = true;

    const updatedUser = await user.save();

    res.status(201).json(updatedUser);
  }

  async upsertUser(req: ApiRequest<OrgParam, UpsertUserBody>, res: Response) {
    const org = req.appOrg!;
    const roleId = (req.body.role != null) ? parseInt(req.body.role) : undefined;
    const edipi = req.body.edipi;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const unitFilter = req.body.unitFilter;

    if (roleId == null) {
      throw new BadRequestError('A role id must be supplied when adding a user.');
    }

    if (edipi == null) {
      throw new BadRequestError('An EDIPI must be supplied when adding a user.');
    }

    if (unitFilter == null) {
      throw new BadRequestError('A unit filter must be supplied when adding a user.');
    }

    const role = await Role.findOne({
      where: {
        id: roleId,
        org: org.id,
      },
    });

    if (!role) {
      throw new NotFoundError('The role was not found in the organization.');
    }

    const unitIdFilter = unitFilter.replace('*', '%');

    const units = await Unit.createQueryBuilder()
      .select()
      .where('org_id = :orgId', { orgId: org.id })
      .andWhere('id LIKE :unitIdFilter', { unitIdFilter })
      .getMany();

    if (units.length === 0) {
      throw new NotFoundError('No matching units were found');
    }

    if (edipi === req.appUser.edipi && req.appUserRole?.role.id !== roleId) {
      throw new BadRequestError('You may not edit your own role.');
    }

    let user = await User.findOne({
      relations: ['userRoles', 'userRoles.role', 'userRoles.role.org'],
      where: {
        edipi,
      },
    });

    let newUser = false;
    let savedUser: User | null = null;

    await getManager().transaction(async manager => {
      if (!user) {
        user = manager.create<User>('User', {
          edipi,
        });
        newUser = true;
      }

      if (firstName) {
        user.firstName = firstName;
      }
      if (lastName) {
        user.lastName = lastName;
      }

      if (newUser) {
        await user.addRole(manager, role, unitFilter);
      } else {
        await user.changeRole(manager, org.id, role, unitFilter);
      }
      savedUser = await manager.save(user);
    });

    res.status(newUser ? 201 : 200).json(savedUser ?? {});
  }

  async getOrgUsers(req: ApiRequest<OrgParam>, res: Response) {
    const orgUsers: User[] = [];
    const roles = await Role.find({
      relations: ['userRoles', 'userRoles.user', 'userRoles.user.userRoles', 'userRoles.user.userRoles.role'],
      where: {
        org: req.appOrg,
      },
    });
    for (const role of roles) {
      for (const userRole of (role.userRoles ?? [])) {
        orgUsers.push(userRole.user);
      }
    }
    orgUsers.sort((a, b) => a.edipi.localeCompare(b.edipi));
    res.json(orgUsers);
  }

  async removeUserFromGroup(req: ApiRequest<OrgEdipiParams>, res: Response) {
    const userEDIPI = req.params.edipi;

    if (req.appUser.edipi === userEDIPI) {
      throw new Error('Unable to remove yourself from the group.');
    }

    const user = await User.findOne({
      relations: ['userRoles', 'userRoles.role', 'userRoles.role.org'],
      where: {
        edipi: userEDIPI,
      },
    });

    let savedUser: User | null = null;
    const userRole = user?.userRoles.find(ur => ur.role.org!.id === req.appOrg!.id);

    if (user && userRole) {
      await getManager().transaction(async manager => {
        await user.removeRole(manager, userRole.role);
        savedUser = await manager.save(user);
      });
    }
    res.json(savedUser ?? {});
  }

  async getAccessRequests(req: ApiRequest, res: Response) {
    if (!req.appUser.isRegistered) {
      throw new BadRequestError('User is not registered');
    }

    const accessRequests = await AccessRequest.find({
      where: {
        user: req.appUser,
      },
      relations: ['org', 'org.contact'],
    });

    res.json(accessRequests);
  }

}

type UpsertUserBody = {
  edipi: string
  role: string
  firstName: string
  lastName: string
  unitFilter: string
};

type RegisterUserBody = {
  firstName: string
  lastName: string
  phone: string
  email: string
  service: string
};

export default new UserController();
