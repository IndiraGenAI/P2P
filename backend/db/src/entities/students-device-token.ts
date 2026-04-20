import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("students_device_token_pkey", ["id"], { unique: true })
@Entity("students_device_token", { schema: "public" })
export class StudentsDeviceToken {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "mobile_no", length: 10 })
  mobile_no: string;

  @Column("character varying", { name: "device_token", length: 255 })
  device_token: string;

  @Column("enum", { name: "type", enum: ["IOS", "WEB", "ANDROID"] })
  type: "IOS" | "WEB" | "ANDROID";

  @Column("timestamp without time zone", {
    name: "created_date",
    nullable: true,
  })
  created_date: Date | null;

  @Column("enum", { name: "auth", nullable: true, enum: ["OTP", "MPIN"] })
  auth: "OTP" | "MPIN" | null;
}
