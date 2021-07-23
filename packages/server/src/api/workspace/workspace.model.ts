import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Role } from '../role/role.model';
import { WorkspaceTemplate } from './workspace-template.model';
import { Org } from '../org/org.model';

@Entity()
export class Workspace extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @ManyToOne(() => Org, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'org_id',
  })
  org?: Org;

  @ManyToOne(() => WorkspaceTemplate, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'workspace_template_id',
  })
  workspaceTemplate?: WorkspaceTemplate;

  @Column()
  pii!: boolean;

  @Column()
  phi!: boolean;

  @ManyToMany(() => Role, role => role.workspaces)
  roles?: Role[];

}
