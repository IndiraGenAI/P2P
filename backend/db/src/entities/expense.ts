import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admissions } from './admissions';
import { Branches } from './branches';
import { Categories } from './categories';
import { Departments } from './departments';
import { SubCategories } from './sub-categories';

@Index('expense_pkey', ['id'], { unique: true })
@Entity('expense', { schema: 'public' })
export class Expense {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'admission_id', nullable: true })
  admission_id: number | null;

  @Column('integer', { name: 'branch_id', nullable: true })
  branch_id: number | null;

  @Column('numeric', {
    name: 'paying_amount',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  paying_amount: number | null;

  @Column('character varying', {
    name: 'full_name',
    nullable: true,
    length: 100,
  })
  full_name: string | null;

  @Column('enum', {
    name: 'payable_for',
    nullable: true,
    enum: ['OTHER', 'STUDENT'],
  })
  payable_for: 'OTHER' | 'STUDENT' | null;

  @Column('date', { name: 'pay_date', nullable: true })
  pay_date: Date | null;

  @Column('text', { name: 'comment', nullable: true })
  comment: string | null;

  @Column('enum', {
    name: 'payment_mode',
    nullable: true,
    enum: [
      'CASH',
      'CHEQUE',
      'DD',
      'CREDIT_CARD',
      'DEBIT_CARD',
      'ONLINE_PAYMENT',
      'NEFT/IMPS',
      'PAYTM',
      'BANK_DEPOSIT_(CASH)',
      'CAPITAL_FLOAT_(EMI)',
      'GOOGLE_PAY',
      'PHONE_PAY',
      'BAJAJ_FINSERV_(EMI)',
      'BHIM_UPI_(INDIA)',
      'INSTAMOJO',
      'PAYPAL',
      'RAZORPAY',
    ],
  })
  payment_mode:
    | 'CASH'
    | 'CHEQUE'
    | 'DD'
    | 'CREDIT_CARD'
    | 'DEBIT_CARD'
    | 'ONLINE_PAYMENT'
    | 'NEFT/IMPS'
    | 'PAYTM'
    | 'BANK_DEPOSIT_(CASH)'
    | 'CAPITAL_FLOAT_(EMI)'
    | 'GOOGLE_PAY'
    | 'PHONE_PAY'
    | 'BAJAJ_FINSERV_(EMI)'
    | 'BHIM_UPI_(INDIA)'
    | 'INSTAMOJO'
    | 'PAYPAL'
    | 'RAZORPAY'
    | null;

  @Column('character varying', {
    name: 'bank_name',
    nullable: true,
    length: 100,
  })
  bank_name: string | null;

  @Column('character varying', {
    name: 'bank_branch_name',
    nullable: true,
    length: 100,
  })
  bank_branch_name: string | null;

  @Column('character varying', {
    name: 'transaction_no',
    nullable: true,
    length: 100,
  })
  transaction_no: string | null;

  @Column('date', { name: 'transaction_date', nullable: true })
  transaction_date: Date | null;

  @Column('character varying', {
    name: 'cheque_no',
    nullable: true,
    length: 100,
  })
  cheque_no: string | null;

  @Column('date', { name: 'cheque_date', nullable: true })
  cheque_date: Date | null;

  @Column('enum', {
    name: 'cheque_status',
    nullable: true,
    enum: [
      'TO_BE_DEPOSIT',
      'TO_BE_COLLECTED',
      'TO_BE_BOUNCE',
      'TO_BE_CLEARED',
      'TO_BE_CANCELED',
    ],
  })
  cheque_status:
    | 'TO_BE_DEPOSIT'
    | 'TO_BE_COLLECTED'
    | 'TO_BE_BOUNCE'
    | 'TO_BE_CLEARED'
    | 'TO_BE_CANCELED'
    | null;

  @Column('character varying', {
    name: 'cheque_holder_name',
    nullable: true,
    length: 100,
  })
  cheque_holder_name: string | null;

  @Column('text', { name: 'paid_by', nullable: true })
  paid_by: string | null;

  @Column('boolean', { name: 'status', nullable: true, default: () => 'true' })
  status: boolean | null;

  @Column('character varying', {
    name: 'created_by',
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column('timestamp without time zone', {
    name: 'created_date',
    nullable: true,
  })
  created_date: Date | null;

  @Column('character varying', {
    name: 'updated_by',
    nullable: true,
    length: 100,
  })
  updated_by: string | null;

  @Column('timestamp without time zone', {
    name: 'updated_date',
    nullable: true,
  })
  updated_date: Date | null;

  @Column('integer', { name: 'category_id', nullable: true })
  category_id: number | null;

  @Column('integer', { name: 'subcategory_id', nullable: true })
  subcategory_id: number | null;

  @Column('integer', { name: 'department_id', nullable: true })
  department_id: number | null;

  @ManyToOne(() => Admissions, (admissions) => admissions.expenses)
  @JoinColumn([{ name: 'admission_id', referencedColumnName: 'id' }])
  admission: Admissions;

  @ManyToOne(() => Branches, (branches) => branches.expenses)
  @JoinColumn([{ name: 'branch_id', referencedColumnName: 'id' }])
  branch: Branches;

  @ManyToOne(() => Categories, (categories) => categories.expenses)
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  categorie: Categories;

  @ManyToOne(() => Departments, (departments) => departments.expenses)
  @JoinColumn([{ name: 'department_id', referencedColumnName: 'id' }])
  department: Departments;

  @ManyToOne(() => SubCategories, (subCategories) => subCategories.expenses)
  @JoinColumn([{ name: 'subcategory_id', referencedColumnName: 'id' }])
  subcategorie: SubCategories;
}
