import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from './roles';
import { Users } from './users';
import { Zones } from './zones';
import { UserRoleCourses } from './user-role-courses';
import { UserRoleDepartments } from './user-role-departments';

@Index('user_roles_pkey', ['id'], { unique: true })
@Entity('user_roles', { schema: 'public' })
export class UserRoles {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'role_id' })
  role_id: number;

  @Column('integer', { name: 'user_id' })
  user_id: number;

  @Column('integer', { name: 'zone_id' })
  zone_id: number;

  @Column('integer', { name: 'reporting_user_id' })
  reporting_user_id: number;

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

  @Column('enum', {
    name: 'availability',
    nullable: true,
    enum: ['FULL_TIME', 'PART_TIME', 'VISITOR'],
    default: () => "'FULL_TIME'",
  })
  availability: 'FULL_TIME' | 'PART_TIME' | 'VISITOR' | null;

  @ManyToOne(() => Users, (users) => users.user_roles)
  @JoinColumn([{ name: 'reporting_user_id', referencedColumnName: 'id' }])
  reportingUser: Users;

  @ManyToOne(() => Roles, (roles) => roles.user_roles)
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Roles;

  @ManyToOne(() => Users, (users) => users.user_roles, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;

  @ManyToOne(() => Zones, (zones) => zones.user_roles)
  @JoinColumn([{ name: 'zone_id', referencedColumnName: 'id' }])
  zone: Zones;

  @OneToMany(
    () => UserRoleCourses,
    (user_role_courses) => user_role_courses.user_roles,
  )
  user_role_courses: UserRoleCourses[];

  @OneToMany(
    () => UserRoleDepartments,
    (user_role_departments) => user_role_departments.user_roles,
  )
  user_role_departments: UserRoleDepartments[];
}
