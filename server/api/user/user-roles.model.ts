import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../role/role.model';
import { User } from "./user.model";
import {escapeRegExp} from "../../util/util";

@Entity()
export class UserRole extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 10,
  })
  userId!: string;

  @Column()
  roleId!: number;

  @ManyToOne(() => User, user => user.userRoles)
  user?: User;

  @ManyToOne(() => Role, role => role.user, {
    cascade: true,
    onDelete: 'RESTRICT',
  })
  role?: Role;

  @Column({
    default: '',
  })
  indexPrefix!: string;

  getUnitFilter() {
    return this.indexPrefix.replace(new RegExp(escapeRegExp('-'), 'g'), '_');
  }

  getKibanaIndex() {
    const suffix = this.role?.canViewPHI ? 'phi' : (this.role?.canViewPII ? 'pii' : 'base');
    return `${this.role?.org!.indexPrefix}-${this.getUnitFilter()}-${suffix}-*`;
  }

  getKibanaIndexForMuster(unitId?: string) {
    return `${this.role?.org!.indexPrefix}-${unitId || this.getUnitFilter()}-phi-*`;
  }

}
