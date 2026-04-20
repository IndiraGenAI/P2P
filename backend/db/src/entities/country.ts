import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Area } from "./area";
import { City } from "./city";
import { State } from "./state";

@Index("country_pkey", ["id"], { unique: true })
@Entity("country", { schema: "public" })
export class Country {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("boolean", { name: "status", nullable: true, default: () => "true" })
  status: boolean | null;

  @Column("character varying", {
    name: "created_by",
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column("timestamp without time zone", {
    name: "created_date",
    nullable: true,
  })
  created_date: Date | null;

  @Column("character varying", {
    name: "updated_by",
    nullable: true,
    length: 100,
  })
  updated_by: string | null;

  @Column("timestamp without time zone", {
    name: "updated_date",
    nullable: true,
  })
  updated_date: Date | null;

  @OneToMany(() => Area, (area) => area.country)
  areas: Area[];

  @OneToMany(() => City, (city) => city.country)
  cities: City[];

  @OneToMany(() => State, (state) => state.country)
  states: State[];
}
