import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolePermissions } from './role-permissions';

export enum UserStatus {
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE',
  PENDING = 'PENDING',
}

@Index('users_email_key', ['email'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'first_name', length: 100 })
  first_name: string;

  @Column('character varying', { name: 'last_name', length: 100 })
  last_name: string;

  @Column('character varying', { name: 'email', unique: true, length: 100 })
  email: string;

  @Column('character varying', { name: 'hash', length: 255 })
  hash: string;

  @Column('character varying', { name: 'phone', length: 15 })
  phone: string;

  @Column('timestamp without time zone', { name: 'last_seen', nullable: true })
  last_seen: Date | null;

  @Column('timestamp without time zone', {
    name: 'created_date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_date: Date | null;

  @Column('timestamp without time zone', {
    name: 'modified_date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  modified_date: Date | null;

  @Column('character varying', {
    name: 'created_by',
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column('character varying', {
    name: 'updated_by',
    nullable: true,
    length: 100,
  })
  updated_by: string | null;

  @Column('enum', {
    name: 'status',
    enumName: 'user_status',
    enum: UserStatus,
    default: () => "'PENDING'",
  })
  status: UserStatus;

  @OneToMany(
    () => RolePermissions,
    (rolePermissions) => rolePermissions.created_by2,
  )
  role_permissions: RolePermissions[];
}
