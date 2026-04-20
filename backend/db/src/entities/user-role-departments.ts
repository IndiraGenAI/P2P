import {
  Entity,
  Index,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Departments } from './departments';
import { UserRoles } from './user-roles';

@Index('user_role_departments_pkey', ['id'], { unique: true })
@Entity('user_role_departments', { schema: 'public' })
export class UserRoleDepartments {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'user_role_id' })
  user_role_id: number;

  @Column('integer', { name: 'department_id' })
  department_id: number;

  @ManyToOne(
    () => Departments,
    (departments) => departments.user_role_departments,
  )
  @JoinColumn([{ name: 'department_id', referencedColumnName: 'id' }])
  department: Departments;

  @ManyToOne(() => UserRoles, (userRoles) => userRoles.user_role_departments,{
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: 'user_role_id', referencedColumnName: 'id' }])
  user_roles: UserRoles;
}
