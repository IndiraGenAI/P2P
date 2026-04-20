import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Area } from './area';
import { Country } from './country';
import { State } from './state';

@Index('city_pkey', ['id'], { unique: true })
@Entity('city', { schema: 'public' })
export class City {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'country_id' })
  country_id: number;

  @Column('integer', { name: 'state_id' })
  state_id: number;

  @Column('character varying', { name: 'name', nullable: true, length: 100 })
  name: string | null;

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

  @OneToMany(() => Area, (area) => area.city)
  areas: Area[];

  @ManyToOne(() => Country, (country) => country.cities)
  @JoinColumn([{ name: 'country_id', referencedColumnName: 'id' }])
  country: Country;

  @ManyToOne(() => State, (state) => state.cities)
  @JoinColumn([{ name: 'state_id', referencedColumnName: 'id' }])
  state: State;
}
