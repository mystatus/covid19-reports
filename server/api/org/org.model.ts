import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../role/role.model';
import { MusterConfiguration } from '../unit/unit.model';
import { User } from '../user/user.model';

@Entity()
export class Org extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 200,
  })
  name!: string;

  @Column({
    length: 2048,
  })
  description!: string;

  @Column({
    default: '',
  })
  indexPrefix!: string;

  @Column({
    nullable: true,
  })
  reportingGroup?: string;

  @ManyToOne(() => User, user => user.edipi, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({
    name: 'contact_id',
  })
  contact?: User;

  @Column('json', {
    nullable: false,
    default: '[]',
  })
  defaultMusterConfiguration: MusterConfiguration[] = [];

  async getUsers() {
    const orgUsers: User[] = [];

    const roles = await Role.find({
      relations: ['userRoles', 'userRoles.user', 'userRoles.user.userRoles', 'userRoles.user.userRoles.role'],
      where: {
        org: this,
      },
    });

    for (const role of roles) {
      for (const userRole of (role.userRoles ?? [])) {
        orgUsers.push(userRole.user);
      }
    }

    orgUsers.sort((a, b) => a.edipi.localeCompare(b.edipi));

    return orgUsers;
  }

}
