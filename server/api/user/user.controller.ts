import { Response } from 'express';
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

    if (edipi == req.appUser.edipi && req.appRole?.id !== roleId) {
      throw new BadRequestError('You may not edit your own role.');
    }

    let newUser = false;
    let user = await User.findOne({
      relations: ['roles'],
      where: {
        edipi,
      },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          roles: 'user.roles',
          org: 'roles.org',
        },
      },
    });

    if (!user) {
      user = new User();
      user.edipi = edipi;
      newUser = true;
    }

    if (!user.roles) {
      user.roles = [];
    }

    const orgRoleIndex = user.roles.findIndex(userRole => userRole.org!.id === org.id);

    if (orgRoleIndex >= 0) {
      user.roles.splice(orgRoleIndex, 1);
    }

    user.roles.push(role);

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    const updatedUser = await user.save();

    await res.status(newUser ? 201 : 200).json(updatedUser);
  }

  async getOrgUsers(req: ApiRequest<OrgParam>, res: Response) {
    // TODO: This could potentially be optimized with something like this:
    // SELECT "user".*
    //   FROM role
    // INNER JOIN user_roles
    //   ON role.id = user_roles.role
    // INNER JOIN "user"
    //   ON user_roles."user" = "user"."EDIPI"
    // WHERE role.org_id=1

    const roles = await Role.find({
      where: {
        org: req.appOrg!.id,
      },
    });

    const users: User[] = [];
    for (const role of roles) {
      const roleUsers = await User.createQueryBuilder('user')
        .innerJoin('user.roles', 'role')
        .where('role.id = :id', { id: role.id })
        .getMany();

      roleUsers.forEach(user => {
        user.roles = [role];
        users.push(user);
      });
    }

    res.json(users);
  }

  async removeUserFromGroup(req: ApiRequest<OrgEdipiParams>, res: Response) {
    const userEDIPI = req.params.edipi;

    if (req.appUser.edipi === userEDIPI) {
      throw new Error('Unable to remove yourself from the group.');
    }

    const user = await User.findOne({
      relations: ['roles', 'roles.org'],
      where: {
        edipi: userEDIPI,
      },
    });

    const roleIndex = (user?.roles ?? []).findIndex(userRole => userRole.org!.id === req.appOrg!.id);

    if (roleIndex !== -1) {
      user!.roles!.splice(roleIndex, 1);
      res.json(await user!.save());
    } else {
      res.json({});
    }
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
