import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BatchSingingSheet } from "./batch-singing-sheet";
import { Users } from "./users";
import { BatchStudentAttendances } from "./batch-student-attendances";

@Index("batch_faculty_attendances_pkey", ["id"], { unique: true })
@Entity("batch_faculty_attendances", { schema: "public" })
export class BatchFacultyAttendances {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "batch_singing_sheet_id" })
  batch_singing_sheet_id: number;

  @Column("integer", { name: "user_id" })
  user_id: number;

  @Column("date", { name: "actual_date", nullable: true })
  actual_date: Date | null;

  @Column("numeric", {
    name: "start_time",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  start_time: number | null;

  @Column("numeric", {
    name: "end_time",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  end_time: number | null;

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
  updatedBy: string | null;

  @Column("timestamp without time zone", {
    name: "updated_date",
    nullable: true,
  })
  updated_date: Date | null;

  @Column("enum", {
    name: "type",
    nullable: true,
    enum: ["REGULAR", "REVISION", "REPEAT"],
    default: () => "'REGULAR'",
  })
  type: "REGULAR" | "REVISION" | "REPEAT" | null;

  @ManyToOne(
    () => BatchSingingSheet,
    (batchSingingSheet) => batchSingingSheet.batchFacultyAttendances
  )
  @JoinColumn([{ name: "batch_singing_sheet_id", referencedColumnName: "id" }])
  batchSingingSheet: BatchSingingSheet;

  @ManyToOne(() => Users, (users) => users.batchFacultyAttendances)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @OneToMany(
    () => BatchStudentAttendances,
    (batchStudentAttendances) => batchStudentAttendances.batchFacultyAttendance
  )
  batchStudentAttendances: BatchStudentAttendances[];
}
