import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Actions } from './actions';
import { Pages } from './pages';
import { RolePermissions } from './role-permissions';

@Index('page_actions_page_id_action_id_key', ['action_id', 'page_id'], {
  unique: true,
})
@Index('page_actions_pkey', ['id'], { unique: true })
@Index('page_actions_tag_key', ['tag'], { unique: true })
@Entity('page_actions', { schema: 'public' })
export class PageActions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'page_id', unique: true })
  page_id: number;

  @Column('integer', { name: 'action_id', unique: true })
  action_id: number;

  @Column('character varying', { name: 'tag', unique: true, length: 100 })
  tag: string;

  @ManyToOne(() => Actions, (actions) => actions.page_actions)
  @JoinColumn([{ name: 'action_id', referencedColumnName: 'id' }])
  action: Actions;

  @ManyToOne(() => Pages, (pages) => pages.page_actions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'page_id', referencedColumnName: 'id' }])
  : Pages;

  @OneToMany(
    () => RolePermissions,
    (rolePermissions) => rolePermissions.page_action,
  )
  role_permissions: RolePermissions[];
}
