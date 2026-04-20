import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Area } from "./area";
import { City } from "./city";
import { Country } from "./country";

@Index("state_pkey", ["id"], { unique: true })
@Entity("state", { schema: "public" })
export class State {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "country_id"})
  country_id: number;

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

  @OneToMany(() => Area, (area) => area.state)
  areas: Area[];

  @OneToMany(() => City, (city) => city.state)
  cities: City[];

  @ManyToOne(() => Country, (country) => country.states)
  @JoinColumn([{ name: "country_id", referencedColumnName: "id" }])
  country: Country;
}
