import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import { User } from './user.model';
import { escapeRegExp } from '../../util/util';

@Entity()
export class UserRole extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.userRoles, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user!: User;

  @ManyToOne(() => Role, role => role.userRoles, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  role!: Role;

  @Column({
    default: '',
  })
  indexPrefix!: string;

  getUnitFilter() {
    return this.indexPrefix.replace(new RegExp(escapeRegExp('-'), 'g'), '_');
  }

  getKibanaIndex() {
    if (this.user.rootAdmin) {
      return '*';
    }
    const suffix = this.role.canViewPHI ? 'phi' : (this.role.canViewPII ? 'pii' : 'base');
    return `${this.role.org!.indexPrefix}-${this.getUnitFilter()}-${suffix}-*`;
  }

  getKibanaIndexForMuster(unitId?: string) {
    return `${this.role.org!.indexPrefix}-${unitId || this.getUnitFilter()}-phi-*`;
  }

  getKibanaUserClaim() {
    return `org${this.role.org!.id}-role${this.role.id}`;
  }

  getKibanaRoles() {
    if (this.role.canManageWorkspace) {
      return 'kibana_admin';
    }
    return 'kibana_ro_strict';
  }

  static admin(org: Org, user: User) {
    const userRole = new UserRole();
    userRole.id = 0;
    userRole.user = user;
    userRole.role = Role.admin(org);
    userRole.indexPrefix = '*';
    return userRole;
  }

}
