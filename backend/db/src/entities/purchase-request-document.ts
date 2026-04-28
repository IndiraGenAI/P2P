import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PurchaseRequest } from "./purchase-request";

@Index("purchase_request_documents_pkey", ["id"], { unique: true })
@Entity("purchase_request_documents", { schema: "public" })
export class PurchaseRequestDocument {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "purchase_request_id" })
  purchase_request_id: number;

  @Column("character varying", {
    name: "file_name",
    nullable: true,
    length: 255,
  })
  file_name: string | null;

  @Column("text", { name: "file_path", nullable: true })
  file_path: string | null;

  @Column("character varying", {
    name: "file_type",
    nullable: true,
    length: 100,
  })
  file_type: string | null;

  @Column("bigint", { name: "file_size", nullable: true })
  file_size: string | null;

  @Column("character varying", {
    name: "uploaded_by",
    nullable: true,
    length: 100,
  })
  uploaded_by: string | null;

  @Column("timestamp without time zone", {
    name: "uploaded_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  uploaded_date: Date | null;

  @ManyToOne(() => PurchaseRequest, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "purchase_request_id", referencedColumnName: "id" }])
  purchase_request: PurchaseRequest;
}
