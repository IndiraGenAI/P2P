import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { Users } from "./users";
  import { CvVolunteers } from "./cv-volunteers";
import { Branches } from "./branches";
  
  @Index("cv_planings_pkey", ["id"], { unique: true })
  @Entity("cv_planings", { schema: "public" })
  export class CvPlanings {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;
  
    @Column("character varying", { name: "company_name", length: 250 })
    company_name: string;

    @Column("integer", { name: "branch_id" })
    branch_id: number;
  
    @Column("text", { name: "company_address" })
    company_address: string;
  
    @Column("timestamp without time zone", {
      name: "visit_datetime",
      nullable: true,
    })
    visit_datetime: Date | null;
  
    @Column("text", { name: "details", nullable: true })
    details: string | null;
    
    @Column("integer", { name: "execute_by_user_id" })
    execute_by_user_id: number;

    @Column("enum", {
      name: "status",
      enum: ["PENDING", "COMPLETED"],
      default: () => "'PENDING'",
    })
    status: "PENDING" | "COMPLETED";
  
    @Column("timestamp without time zone", {
      name: "created_date",
      nullable: true,
    })
    created_date: Date | null;
  
    @Column("timestamp without time zone", {
      name: "modified_date",
      nullable: true,
    })
    modified_date: Date | null;
  
    @Column("character varying", {
      name: "created_by",
      nullable: true,
      length: 100,
    })
    created_by: string | null;
  
    @Column("character varying", {
      name: "updated_by",
      nullable: true,
      length: 100,
    })
    updated_by: string | null;

    @ManyToOne(() => Branches, (branches) => branches.cvPlanings)
    @JoinColumn([{ name: "branch_id", referencedColumnName: "id" }])
    branch: Branches;
  
    @ManyToOne(() => Users, (users) => users.cvPlanings)
    @JoinColumn([{ name: "execute_by_user_id", referencedColumnName: "id" }])
    executeByUser: Users;
  
    @OneToMany(() => CvVolunteers, (cvVolunteers) => cvVolunteers.cvPlanning)
    cvVolunteers: CvVolunteers[];
  }
  