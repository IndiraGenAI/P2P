import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Batches } from "./batches";
import { Subcourses } from "./subcourses";
import { TemplateShiningSheetTopics } from "./template-shining-sheet-topics";

@Index("template_shining_sheet_pkey", ["id"], { unique: true })
@Entity("template_shining_sheet", { schema: "public" })
export class TemplateShiningSheet {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "subcourse_id" })
  subcourse_id: number;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

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

  @OneToMany(() => Batches, (batches) => batches.template)
  batches: Batches[];

  @ManyToOne(() => Subcourses, (subcourses) => subcourses.templateShiningSheets)
  @JoinColumn([{ name: "subcourse_id", referencedColumnName: "id" }])
  subcourse: Subcourses;

  @OneToMany(
    () => TemplateShiningSheetTopics,
    (templateShiningSheetTopics) =>
      templateShiningSheetTopics.templateSingingSheet
  )
  templateShiningSheetTopics: TemplateShiningSheetTopics[];
}
