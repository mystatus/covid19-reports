import { Response } from 'express';
import { getManager } from 'typeorm';
import { AccessRequest } from '../access-request/access-request.model';
import { ApiRequest, OrgEdipiParams, OrgParam } from '../index';
import { User } from './user.model';
import { Role } from '../role/role.model';
import { BadRequestError, NotFoundError } from '../../util/error-types';

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

    await res.status(201).json(updatedUser);
  }

  async upsertUser(req: ApiRequest<OrgParam, UpsertUserBody>, res: Response) {
    const org = req.appOrg!;
    const roleId = (req.body.role != null) ? parseInt(req.body.role) : undefined;
    const edipi = req.body.edipi;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    if (roleId == null) {
      throw new BadRequestError('A role id must be supplied when adding a user.');
    }

    if (edipi == null) {
      throw new BadRequestError('An EDIPI must be supplied when adding a user.');
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

    if (edipi === req.appUser.edipi && req.appRole?.id !== roleId) {
      throw new BadRequestError('You may not edit your own role.');
    }

    let newUser = false;
    let savedUser: User | null = null;

    await getManager().transaction(async transactionalEntityManager => {
      let user = await transactionalEntityManager.findOne<User>('User', {
        relations: ['userRoles', 'userRoles.role', 'userRoles.role.org'],
        where: {
          edipi,
        },
        join: {
          alias: 'user',
          leftJoinAndSelect: {
            userRoles: 'user.userRoles',
            role: 'userRoles.role',
            org: 'role.org',
          },
        },
      });

      if (!user) {
        user = transactionalEntityManager.create<User>('User', {
          edipi,
        });
        newUser = true;
      }

      user.addRole(transactionalEntityManager, role);

      if (firstName) {
        user.firstName = firstName;
      }

      if (lastName) {
        user.lastName = lastName;
      }

      savedUser = await transactionalEntityManager.save(user);
    });

    await res.status(newUser ? 201 : 200).json(savedUser ?? {});
  }

  async getOrgUsers(req: ApiRequest<OrgParam>, res: Response) {
    let orgUsers = new Array<User>();

    const orgRoles: Array<{ id: number }> = await getManager().query(`SELECT r.id FROM role r WHERE r.org_id = ${req.appOrg!.id}`);
    if (orgRoles.length > 0) {
      const roleIds = orgRoles.map(role => role.id);

      const userRoles: Array<{ edipi: string }> = await getManager().query(`SELECT ur.user_edipi as edipi FROM user_role ur WHERE ur.role_id in (${roleIds})`);
      if (userRoles.length > 0) {
        const userIds = userRoles.map(userRole => userRole.edipi);
        orgUsers = await User.findByIds(userIds, {
          relations: ['userRoles', 'userRoles.role'],
        });
      }
    }

    res.json(orgUsers);
  }

  async removeUserFromGroup(req: ApiRequest<OrgEdipiParams>, res: Response) {
    const userEDIPI = req.params.edipi;

    if (req.appUser.edipi === userEDIPI) {
      throw new Error('Unable to remove yourself from the group.');
    }
    let savedUser: User | null = null;

    await getManager().transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne<User>('User', {
        relations: ['userRoles', 'userRoles.role', 'userRoles.role.org'],
        where: {
          edipi: userEDIPI,
        },
      });

      const userRole = user?.userRoles.find(ur => ur.role.org!.id === req.appOrg!.id);
      if (user && userRole) {
        await user.removeRole(transactionalEntityManager, userRole.role);
        savedUser = await transactionalEntityManager.save(user);
      }
    });
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
};

type RegisterUserBody = {
  firstName: string
  lastName: string
  phone: string
  email: string
  service: string
};

export default new UserController();
