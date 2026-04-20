import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branches } from './branches';
import { UserRoles } from './user-roles';

@Index('code_unique', ['code'], { unique: true })
@Index('zones_pkey', ['id'], { unique: true })
@Index('name_unique', ['name'], { unique: true })
@Entity('zones', { schema: 'public' })
export class Zones {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'parent_id' })
  parent_id: number;

  @Column('character varying', { name: 'code', unique: true, length: 50 })
  code: string;

  @Column('character varying', { name: 'name', unique: true, length: 100 })
  name: string;

  @Column('enum', { name: 'type', enum: ['PUBLIC', 'PRIVATE'] })
  type: 'PUBLIC' | 'PRIVATE';

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

  @OneToMany(() => Branches, (branches) => branches.zone)
  branches: Branches[];

  @OneToMany(() => UserRoles, (user_roles) => user_roles.zone)
  user_roles: UserRoles[];

  @ManyToOne(() => Zones, (zones) => zones.zones)
  @JoinColumn([{ name: 'parent_id', referencedColumnName: 'id' }])
  parent: Zones;

  @OneToMany(() => Zones, (zones) => zones.parent)
  zones: Zones[];
}
