import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolePermissions } from './role-permissions';
import { UserRoles } from './user-roles';

@Index('roles_pkey', ['id'], { unique: true })
@Entity('roles', { schema: 'public' })
export class Roles {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', length: 100 })
  name: string;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('boolean', { name: 'status', nullable: true, default: () => 'true' })
  status: boolean | null;

  @Column('character varying', {
    name: 'created_by',
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column('timestamp without time zone', {
    name: 'created_date',
    nullable: true,
  })
  created_date: Date | null;

  @Column('character varying', {
    name: 'updated_by',
    nullable: true,
    length: 100,
  })
  updated_by: string | null;

  @Column('timestamp without time zone', {
    name: 'updated_date',
    nullable: true,
  })
  updated_date: Date | null;

  @Column('enum', {
    name: 'type',
    nullable: true,
    enum: ['SUPER_ADMIN', 'ADMIN', 'FACULTY_HEAD', 'FACULTY', 'MANAGER'],
  })
  type: 'SUPER_ADMIN' | 'ADMIN' | 'FACULTY_HEAD' | 'FACULTY' | 'MANAGER' | null;

  @OneToMany(() => UserRoles, (user_roles) => user_roles.role)
  user_roles: UserRoles[];

  @OneToMany(() => RolePermissions, (role_permissions) => role_permissions.role)
  role_permissions: RolePermissions[];
}
