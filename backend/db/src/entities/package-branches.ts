import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branches } from './branches';
import { Packages } from './packages';

@Index('package_branches_pkey', ['id'], { unique: true })
@Entity('package_branches', { schema: 'public' })
export class PackageBranches {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'branch_id' })
  branch_id: number;

  @Column('integer', { name: 'package_id' })
  package_id: number;

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

  @ManyToOne(() => Branches, (branches) => branches.package_branches)
  @JoinColumn([{ name: 'branch_id', referencedColumnName: 'id' }])
  branch: Branches;

  @ManyToOne(() => Packages, (packages) => packages.package_branches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'package_id', referencedColumnName: 'id' }])
  package: Packages;
}
