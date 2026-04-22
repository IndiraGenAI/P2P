import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PageActions } from './page-actions';

@Index('pages_pkey', ['id'], { unique: true })
@Index('pages_page_code_key', ['page_code'], { unique: true })
@Entity('pages', { schema: 'public' })
export class Pages {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'page_code',
    unique: true,
    length: 100,
  })
  page_code: string;

  @Column('character varying', { name: 'name', length: 100 })
  name: string;

  @Column('integer', { name: 'parent_page_id', nullable: true })
  parent_page_id: number | null;

  @Column('boolean', { name: 'active', default: () => 'true' })
  active: boolean;

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

  @Column("integer", { name: "sequence", nullable: true })
  sequence: number | null;

  @OneToMany(() => PageActions, (page_actions) => page_actions.page)
  page_actions: PageActions[];

  @ManyToOne(() => Pages, (pages) => pages.pages)
  @JoinColumn([{ name: 'parent_page_id', referencedColumnName: 'id' }])
  parent_page: Pages;

  @OneToMany(() => Pages, (pages) => pages.parent_page)
  pages: Pages[];
}
