import {
  Entity,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Column,
  EntityManager,
} from 'typeorm';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import { User } from './user.model';
import { Unit } from '../unit/unit.model';

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

  @ManyToMany(() => Unit, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'user_role_unit',
    joinColumn: {
      name: 'user_role',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'unit',
      referencedColumnName: 'id',
    },
  })
  units!: Unit[];

  @Column({
    default: false,
  })
  allUnits: boolean = false;

  @Column('json', {
    default: '{}',
    nullable: false,
  })
  favoriteDashboards!: {
    [workspaceId: string]: {
      [dashboardUuid: string]: boolean;
    };
  };

  addFavoriteDashboard(workspaceId: string, dashboardUuid: string, manager: EntityManager) {
    if (this.hasFavoriteDashboard(workspaceId, dashboardUuid)) {
      throw new Error('This dashboard is already favorited!');
    }

    if (!this.favoriteDashboards[workspaceId]) {
      this.favoriteDashboards[workspaceId] = {};
    }

    this.favoriteDashboards[workspaceId][dashboardUuid] = true;

    return manager.save(this);
  }

  removeFavoriteDashboard(workspaceId: string, dashboardUuid: string, manager: EntityManager) {
    if (!this.hasFavoriteDashboard(workspaceId, dashboardUuid)) {
      throw new Error('This dashboard has not been favorited!');
    }

    delete this.favoriteDashboards[workspaceId][dashboardUuid];

    return manager.save(this);
  }

  hasFavoriteDashboard(workspaceId: string, dashboardUuid: string) {
    if (this.favoriteDashboards[workspaceId]) {
      return Boolean(this.favoriteDashboards[workspaceId][dashboardUuid]);
    }

    return false;
  }

  getUnits() {
    if (this.allUnits) {
      return Unit.find({
        relations: ['org'],
        where: {
          org: this.role.org!.id,
        },
      });
    }
    return this.units;
  }

  getUnit(unitId: number) {
    if (this.allUnits) {
      return Unit.findOne({
        relations: ['org'],
        where: {
          id: unitId,
          org: this.role.org!.id,
        },
      });
    }
    return this.units.find(unit => unit.id === unitId);
  }

  static admin(org: Org, user: User) {
    const userRole = new UserRole();
    userRole.id = 0;
    userRole.user = user;
    userRole.role = Role.admin(org);
    userRole.allUnits = true;
    return userRole;
  }

}
