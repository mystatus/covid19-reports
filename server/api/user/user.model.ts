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

  async addRole(entityManager: EntityManager, role: Role, indexPrefix?: string): Promise<UserRole> {
    let userRole = await entityManager.findOne<UserRole>('UserRole', {
      where: {
        userEdipi: this.edipi,
        roleId: role.id,
      },
    });
    if (!userRole) {
      userRole = entityManager.create<UserRole>('UserRole', {
        user: this,
        role,
        indexPrefix: indexPrefix || role.defaultIndexPrefix,
      });
      userRole = await entityManager.save(userRole);
    }
    return userRole;
  }

  async addRoles(entityManager: EntityManager, roles: Role[]): Promise<void> {
    for (const role of roles) {
      await this.addRole(entityManager, role);
    }
  }

  async removeRole(entityManager: EntityManager, role: Role): Promise<UserRole> {
    const found = await entityManager.findOne<UserRole>('UserRole', {
      where: {
        userEdipi: this.edipi,
        roleId: role.id,
      },
    });
    if (found) {
      return entityManager.remove(found); // Consider using softRemove()
    }
    throw new NotFoundError(`Error removing role. User ${this.edipi} does not have role ${role.name}`);
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
