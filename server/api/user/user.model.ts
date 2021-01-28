import {
  Entity, PrimaryColumn, Column, BaseEntity, OneToMany, EntityManager,
} from 'typeorm';
import { NotFoundError } from '../../util/error-types';
import { Role } from '../role/role.model';
import { UserRole } from './user-role.model';

const internalUserEdipi = 'internal';

@Entity()
export class User extends BaseEntity {

  @PrimaryColumn({
    length: 10,
  })
  edipi!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column()
  service!: string;

  @Column({
    default: true,
  })
  enabled?: boolean;

  @Column({
    default: false,
  })
  rootAdmin?: boolean;

  @Column({
    default: false,
  })
  isRegistered?: boolean;


  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles!: UserRole[];

  async addRole(manager: EntityManager, role: Role, indexPrefix?: string): Promise<User> {
    let userRole = await this.findUserRole(role);
    if (!userRole) {
      userRole = manager.create<UserRole>('UserRole', {
        user: this,
        role,
        indexPrefix: indexPrefix || role.defaultIndexPrefix,
      });
      this.userRoles.push(userRole);
      await manager.save(userRole);
    }
    return this;
  }

  async addRoles(manager: EntityManager, roles: Role[]): Promise<User> {
    for (const role of roles) {
      await this.addRole(manager, role);
    }
    return this;
  }

  async changeRole(manager: EntityManager, role: Role, indexPrefix?: string): Promise<User> {
    let userRole = await this.findUserRole(role);
    if (!userRole) {
      if (this.userRoles.length === 1) {
        await this.removeRole(manager, undefined, this.userRoles[0]);
      }
      userRole = manager.create<UserRole>('UserRole', {
        user: this,
        role,
        indexPrefix: indexPrefix || role.defaultIndexPrefix,
      });
      this.userRoles.push(userRole);
      await manager.save(userRole);
    }
    return this;
  }

  async removeRole(manager: EntityManager, role?: Role, userRole?: UserRole): Promise<User> {
    if (role || userRole) {
      const found = userRole ?? await this.findUserRole(role!);
      if (found) {
        const index = this.userRoles.indexOf(found);
        this.userRoles.splice(index, 1);
        await manager.remove(found);
      } else if (role) {
        throw new NotFoundError(`Error removing role. User ${this.edipi} does not have role ${role.name}`);
      }
    }
    return this;
  }

  protected async findUserRole(role: Role): Promise<UserRole | undefined> {
    if (!this.userRoles) {
      if (!this.hasId()) {
        this.userRoles = [];
      } else {
        this.userRoles = await UserRole.find({
          relations: ['role', 'role.org'],
          where: {
            user: this,
          },
        });
      }
    }
    return this.userRoles.find(userRole => {
      return userRole.role.id === role.id;
    });
  }

  public isInternal() {
    return this.edipi === internalUserEdipi;
  }

  static internal() {
    const internalUser = new User();
    internalUser.edipi = internalUserEdipi;
    internalUser.firstName = 'Internal';
    internalUser.lastName = 'User';
    internalUser.email = 'internal@statusengine.com';
    internalUser.phone = '000-000-0000';
    internalUser.service = 'Space Force';
    internalUser.enabled = true;
    internalUser.isRegistered = true;
    internalUser.rootAdmin = true;

    return internalUser;
  }
}
