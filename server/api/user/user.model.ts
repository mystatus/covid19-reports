import {
  Entity, PrimaryColumn, Column, BaseEntity, ManyToMany, JoinTable, ManyToOne, OneToMany,
} from 'typeorm';
import { Role } from '../role/role.model';
import {UserRole} from "./user-roles.model";

const internalUserEdipi = 'internal';

@Entity()
export class User extends BaseEntity {

  @PrimaryColumn({
    length: 10,
  })
  edipi!: string;

  //TODO: Can we still keep this, and is it needed?
  @ManyToMany(() => Role, {
    cascade: true,
    onDelete: 'RESTRICT',
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user',
      referencedColumnName: 'edipi',
    },
    inverseJoinColumn: {
      name: 'role',
      referencedColumnName: 'id',
    },
  })
  roles?: Role[];

  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles?: UserRole[];

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
