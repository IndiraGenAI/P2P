import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Admissions } from './admissions';
import { Branches } from './branches';
import { ChequeComments } from './cheque-comments';
import { Invoices } from './invoices';

@Index('admission_installments_pkey', ['id'], { unique: true })
@Entity('admission_installments', { schema: 'public' })
export class AdmissionInstallments {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'admission_id' })
  admission_id: number;

  @Column('integer', { name: 'branch_id' })
  branch_id: number;

  @Column('date', { name: 'installment_date', nullable: true })
  installment_date: Date | null | string;

  @Column('date', { name: 'commitment_date', nullable: true })
  commitment_date: string | null;

  @Column('numeric', { name: 'installment_no', nullable: true })
  installment_no: number | null;

  @Column('numeric', {
    name: 'due_amount',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  due_amount: number | null;

  @Column('numeric', {
    name: 'pay_amount',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  pay_amount: number | null;

  @Column('date', { name: 'pay_date', nullable: true })
  pay_date: string | null;

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

  @Column('enum', {
    name: 'admission_status',
    nullable: true,
    enum: [
      'ONGOING',
      'PENDING',
      'HOLD',
      'TERMINATED',
      'CANCELLED',
      'COMPLETED',
      'TRANSFERRED_IN',
      'TRANSFERRED_OUT',
    ],
  })
  admission_status:
    | 'ONGOING'
    | 'PENDING'
    | 'HOLD'
    | 'TERMINATED'
    | 'CANCELLED'
    | 'COMPLETED'
    | 'TRANSFERRED_IN'
    | 'TRANSFERRED_OUT'
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

  @Column('boolean', {
    name: 'send_sms_student',
    nullable: true,
    default: () => 'false',
  })
  send_sms_student: boolean | null;

  @Column('boolean', {
    name: 'send_email_parents',
    nullable: true,
    default: () => 'false',
  })
  send_email_parents: boolean | null;

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

  @Column('enum', {
    name: 'status',
    nullable: true,
    enum: ['PAID', 'UNPAID', 'ADVANCE_PAID', 'CANCELLED'],
  })
  status: 'PAID' | 'UNPAID' | 'ADVANCE_PAID' | 'CANCELLED' | null;

  @Column('boolean', {
    name: 'send_email_student',
    nullable: true,
    default: () => 'false',
  })
  send_email_student: boolean | null;

  @Column('boolean', {
    name: 'send_sms_parents',
    nullable: true,
    default: () => 'false',
  })
  send_sms_parents: boolean | null;

  @Column('numeric', {
    name: 'installment_amount',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  installment_amount: number | null;

  @Column('text', { name: 'remarks', nullable: true })
  remarks: string | null;

  @ManyToOne(
    () => Admissions,
    (admissions) => admissions.admission_installments,
  )
  @JoinColumn([{ name: 'admission_id', referencedColumnName: 'id' }])
  admission: Admissions;

  @ManyToOne(() => Branches, (branches) => branches.admission_installments)
  @JoinColumn([{ name: 'branch_id', referencedColumnName: 'id' }])
  branch: Branches;

  @OneToMany(() => Invoices, (invoices) => invoices.installment)
  invoices: Invoices[];

  @OneToMany(
    () => ChequeComments,
    (chequeComments) => chequeComments.admissionInstallments,
  )
  chequeComments: ChequeComments[];
}
