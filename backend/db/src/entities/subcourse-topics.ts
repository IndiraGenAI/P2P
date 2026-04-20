import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BatchSingingSheet } from './batch-singing-sheet';
import { SubTopics } from './sub-topics';
import { Subcourses } from './subcourses';

@Index('subcourse_topics_pkey', ['id'], { unique: true })
@Entity('subcourse_topics', { schema: 'public' })
export class SubcourseTopics {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'subcourse_id' })
  subcourse_id: number;

  @Column('character varying', { name: 'name', nullable: true, length: 100 })
  name: string | null;

  @Column('numeric', {
    name: 'sequence',
    nullable: true,
    precision: 5,
    scale: 2,
  })
  sequence: number | null;

  @Column('boolean', { name: 'status', nullable: true, default: () => 'true' })
  status: boolean | null;

  @Column('enum', {
    name: 'type',
    nullable: true,
    enum: ['LECTURE', 'PROJECT', 'VIVA', 'EXAM_PRACTICAL', 'EXAM_THEORY'],
  })
  type: 'LECTURE' | 'PROJECT' | 'VIVA' | 'EXAM_PRACTICAL' | 'EXAM_THEORY' | null;

  @Column('numeric', {
    name: 'duration',
    nullable: true,
    precision: 5,
    scale: 2,
  })
  duration: number | null;

  @Column('numeric', { name: 'marks', nullable: true, precision: 5, scale: 2 })
  marks: number | null;

  @Column('timestamp without time zone', {
    name: 'created_date',
    nullable: true,
  })
  created_date: Date | null;

  @Column('character varying', {
    name: 'created_by',
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column('timestamp without time zone', {
    name: 'updated_date',
    nullable: true,
  })
  updated_date: Date | null;

  @Column('character varying', {
    name: 'updated_by',
    nullable: true,
    length: 100,
  })
  updated_by: string | null;

  @OneToMany(() => SubTopics, (subTopics) => subTopics.topic)
  subTopics: SubTopics[];

  @OneToMany(
    () => BatchSingingSheet,
    (batchSingingSheet) => batchSingingSheet.parent,
  )
  batchSingingSheets: BatchSingingSheet[];

  @ManyToOne(() => Subcourses, (subcourses) => subcourses.subcourseTopics)
  @JoinColumn([{ name: 'subcourse_id', referencedColumnName: 'id' }])
  subcourse: Subcourses;
}
