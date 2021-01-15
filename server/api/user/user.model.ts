import {
  Entity, PrimaryColumn, Column, BaseEntity, ManyToMany, JoinTable, ManyToOne, OneToMany,
} from 'typeorm';
import { Role } from '../role/role.model';
import { UserRole } from "./user-roles.model";

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
  userRoles: UserRole[];

  get roles(): Role[] {
    // TODO determine whether/how to return the indexPrefix?
    return this.userRoles.map(userRole => userRole.role);
  }

  public async addRole(role: Role, indexPrefix?: string): Promise<UserRole> {
    let userRole = await UserRole.findOne({
      where: {
        userId: this.edipi,
        roleId: role.id
      }
    });
    if (!userRole) {
      userRole = new UserRole();
      userRole.userId = this.edipi;
      userRole.roleId = role.id;
      userRole.indexPrefix = indexPrefix || role.defaultIndexPrefix;
      this.userRoles.push(userRole);
    }
    return Promise.resolve(userRole);
  }

  public async removeRole(role: Role): Promise<UserRole> {
    const found = await UserRole.findOne({
      where: {
        userId: this.edipi,
        roleId: role.id
      }
    });
    if (found) {
      return Promise.resolve(found.remove()); // TODO consider softRemove()
    }
    return Promise.reject(`Error removing role. User ${this.edipi} does not have role ${role.name}`);
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
