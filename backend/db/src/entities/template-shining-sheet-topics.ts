import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TemplateShiningSheet } from "./template-shining-sheet";

@Index("template_shining_sheet_topics_pkey", ["id"], { unique: true })
@Entity("template_shining_sheet_topics", { schema: "public" })
export class TemplateShiningSheetTopics {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "template_singing_sheet_id" })
  template_singing_sheet_id: number;

  @Column("integer", { name: "parent_id" })
  parent_id: number;

  @Column("character varying", { name: "name", nullable: true, length: 100 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("numeric", {
    name: "sequence",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  sequence: number | null;

  @Column("enum", {
    name: "type",
    nullable: true,
    enum: ["LECTURE", "PROJECT", "VIVA", "EXAM_PRACTICAL", "EXAM_THEORY"],
  })
  type:
    | "LECTURE"
    | "PROJECT"
    | "VIVA"
    | "EXAM_PRACTICAL"
    | "EXAM_THEORY"
    | null;

  @Column("numeric", {
    name: "duration",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  duration: number | null;

  @Column("numeric", { name: "marks", nullable: true, precision: 5, scale: 2 })
  marks: number | null;

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

  @ManyToOne(
    () => TemplateShiningSheetTopics,
    (templateShiningSheetTopics) =>
      templateShiningSheetTopics.templateShiningSheetTopics
  )
  @JoinColumn([{ name: "parent_id", referencedColumnName: "id" }])
  parent: TemplateShiningSheetTopics;

  @OneToMany(
    () => TemplateShiningSheetTopics,
    (templateShiningSheetTopics) => templateShiningSheetTopics.parent
  )
  templateShiningSheetTopics: TemplateShiningSheetTopics[];

  @ManyToOne(
    () => TemplateShiningSheet,
    (templateShiningSheet) => templateShiningSheet.templateShiningSheetTopics
  )
  @JoinColumn([
    { name: "template_singing_sheet_id", referencedColumnName: "id" },
  ])
  templateSingingSheet: TemplateShiningSheet;
}
