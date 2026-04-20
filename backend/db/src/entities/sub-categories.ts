import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Categories } from "./categories";
import { Expense } from "./expense";
import { ExpenseMaster } from "./expense-master";

@Index("sub_categories_pkey", ["id"], { unique: true })
@Entity("sub_categories", { schema: "public" })
export class SubCategories {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "category_id" })
  category_id: number;

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

  @OneToMany(() => Expense, (expense) => expense.subcategory_id)
  expenses: Expense[];

  @ManyToOne(() => Categories, (categories) => categories.subCategories)
  @JoinColumn([{ name: "category_id", referencedColumnName: "id" }])
  category: Categories;


}
