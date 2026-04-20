import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SubcourseTopics } from "./subcourse-topics";

@Index("sub_topics_pkey", ["id"], { unique: true })
@Entity("sub_topics", { schema: "public" })
export class SubTopics {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "topic_id"})
  topic_id: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("numeric", {
    name: "sequence",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  sequence: number | null;

  @Column("boolean", { name: "status", nullable: true, default: () => "true" })
  status: boolean | null;

  @Column("timestamp without time zone", {
    name: "created_date",
    nullable: true,
  })
  created_date: Date | null;

  @Column("character varying", {
    name: "created_by",
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column("timestamp without time zone", {
    name: "updated_date",
    nullable: true,
  })
  updated_date: Date | null;

  @Column("character varying", {
    name: "updated_by",
    nullable: true,
    length: 100,
  })
  updated_by: string | null;

  @Column("character varying", {
    name: "std_res_link",
    nullable: true,
    length: 512,
  })
  std_res_link: string | null;

  @Column("character varying", {
    name: "faculty_res_link",
    nullable: true,
    length: 512,
  })
  faculty_res_link: string | null;


  @ManyToOne(
    () => SubcourseTopics,
    (subcourseTopics) => subcourseTopics.subTopics,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "topic_id", referencedColumnName: "id" }])
  topic: SubcourseTopics;
}
