import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Packages } from './packages';
import { Subcourses } from './subcourses';

@Index('package_subcourses_pkey', ['id'], { unique: true })
@Entity('package_subcourses', { schema: 'public' })
export class PackageSubcourses {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'package_id' })
  package_id: number;

  @Column('integer', { name: 'subcourse_id' })
  subcourse_id: number;

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

  @ManyToOne(() => Packages, (packages) => packages.package_subcourses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'package_id', referencedColumnName: 'id' }])
  package: Packages;

  @ManyToOne(() => Subcourses, (subcourses) => subcourses.package_subcourses)
  @JoinColumn([{ name: 'subcourse_id', referencedColumnName: 'id' }])
  subcourse: Subcourses;
}
