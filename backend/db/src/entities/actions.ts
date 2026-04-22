import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PageActions } from './page-actions';

@Index('actions_action_code_key', ['action_code'], { unique: true })
@Index('actions_pkey', ['id'], { unique: true })
@Entity('actions', { schema: 'public' })
export class Actions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'action_code',
    unique: true,
    length: 100,
  })
  action_code: string;

  @Column('character varying', { name: 'name', length: 100 })
  name: string;

  @Column('timestamp without time zone', {
    name: 'created_date',
    nullable: true,
  })
  created_date: Date | null;

  @Column('timestamp without time zone', {
    name: 'updated_date',
    nullable: true,
  })
  updated_date: Date | null;

  @OneToMany(() => PageActions, (page_actions) => page_actions.action)
  page_actions: PageActions[];
}
