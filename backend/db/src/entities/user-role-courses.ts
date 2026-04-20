import {
  Entity,
  Index,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course';
import { UserRoles } from './user-roles';

@Index('user_role_courses_pkey', ['id'], { unique: true })
@Entity('user_role_courses', { schema: 'public' })
export class UserRoleCourses {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'user_role_id' })
  user_role_id: number;

  @Column('integer', { name: 'course_id' })
  course_id: number;

  @ManyToOne(() => Course, (course) => course.user_role_courses)
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  course: Course;

  @ManyToOne(() => UserRoles, (userRoles) => userRoles.user_role_courses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_role_id', referencedColumnName: 'id' }])
  user_roles: UserRoles;
}
