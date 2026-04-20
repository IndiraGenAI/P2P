import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users';
import { PageActions } from './-actions';
import { Roles } from './roles';

@Index('role_permissions_pkey', ['id'], { unique: true })
@Entity('role_permissions', { schema: 'public' })
export class RolePermissions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'role_id', nullable: true })
  role_id: number | null;

  @Column('integer', { name: 'page_action_id', nullable: true })
  page_action_id: number | null;

  @Column('integer', { name: 'created_by', nullable: true })
  created_by: number | null;

  @Column('timestamp without time zone', {
    name: 'created_date',
    nullable: true,
  })
  created_date: Date | null;

  @ManyToOne(() => Users, (users) => users.role_permissions)
  @JoinColumn([{ name: 'created_by', referencedColumnName: 'id' }])
  created_by2: Users;

  @ManyToOne(
    () => PageActions,
    (page_actions) => page_actions.role_permissions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'page_action_id', referencedColumnName: 'id' }])
  page_action: PageActions;

  @ManyToOne(() => Roles, (roles) => roles.role_permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Roles;
}
