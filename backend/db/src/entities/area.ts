import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { City } from "./city";
import { Country } from "./country";
import { State } from "./state";

@Index("area_pkey", ["id"], { unique: true })
@Entity("area", { schema: "public" })
export class Area {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "city_id"})
  city_id: number;

  @Column("integer", { name: "country_id"})
  country_id: number;

  @Column("integer", { name: "state_id"})
  state_id: number;

  @Column("character varying", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("character varying", { name: "pincode", nullable: true, length: 6 })
  pincode: string | null;

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
  @ManyToOne(() => City, (city) => city.areas)
  @JoinColumn([{ name: "city_id", referencedColumnName: "id" }])
  city: City;

  @ManyToOne(() => Country, (country) => country.areas)
  @JoinColumn([{ name: "country_id", referencedColumnName: "id" }])
  country: Country;

  @ManyToOne(() => State, (state) => state.areas)
  @JoinColumn([{ name: "state_id", referencedColumnName: "id" }])
  state: State;
}
