import {
  Entity, PrimaryColumn, Column, BaseEntity, ManyToMany, JoinTable,
} from 'typeorm';
import { Role } from '../role/role.model';

@Entity()
export class User extends BaseEntity {
  static internalUserEdipi = '_internal_';

  @PrimaryColumn({
    length: 10,
  })
  edipi!: string;

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
    return this.edipi === User.internalUserEdipi;
  }

  static internal() {
    const internalUser = new User();
    internalUser.edipi = User.internalUserEdipi;
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
