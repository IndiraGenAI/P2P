import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { CvPlanings } from "./cv-planings";
  import { Users } from "./users";
  
  @Index("cv_volunteers_pkey", ["id"], { unique: true })
  @Entity("cv_volunteers", { schema: "public" })
  export class CvVolunteers {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column("integer", { name: "cv_planning_id" })
    cv_planning_id: number;
    
    @Column("integer", { name: "user_id" })
    user_id: number;
  
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
  
    @ManyToOne(() => CvPlanings, (cvPlanings) => cvPlanings.cvVolunteers)
    @JoinColumn([{ name: "cv_planning_id", referencedColumnName: "id" }])
    cvPlanning: CvPlanings;
  
    @ManyToOne(() => Users, (users) => users.cvVolunteers)
    @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
    user: Users;
  }
  