import { CreditCard } from 'lucide-react';
import { MasterListPage } from '@/components/master/MasterListPage';
import { Common } from '@/utils/constants/constant';
import {
  createNewPaymentTerm,
  editPaymentTermById,
  removePaymentTermById,
  searchPaymentTermData,
  updatePaymentTermStatus,
} from '@/state/paymentTerm/paymentTerm.action';
import {
  clearPaymentTermMessage,
  paymentTermMasterSelector,
} from '@/state/paymentTerm/paymentTerm.reducer';
import { type IPaymentTermRow } from '@/services/paymentTerm/paymentTerm.service';
import PaymentTermAdd from './Add';
import type { IPaymentTermRecord } from './PaymentTerm.model';

export const PaymentTermPage = () => (
  <MasterListPage<IPaymentTermRecord, IPaymentTermRow>
    pageCode={Common.Modules.MASTER.PAYMENT_TERMS}
    singularLabel="Payment Term"
    pluralLabel="Payment Terms"
    icon={CreditCard}
    selector={paymentTermMasterSelector}
    clearMessage={clearPaymentTermMessage}
    searchAction={searchPaymentTermData}
    createAction={createNewPaymentTerm}
    editAction={editPaymentTermById}
    removeAction={removePaymentTermById}
    updateStatusAction={updatePaymentTermStatus}
    AddForm={PaymentTermAdd}
    extraColumns={[
      {
        key: 'oracle_code',
        label: 'Oracle Code',
        render: (row) =>
          row.oracle_code || (
            <span className="text-xs text-gray-400">—</span>
          ),
      },
    ]}
    buildRecordFromRow={(row) => ({
      id: row.id,
      code: (row.code as string) ?? '',
      name: row.name,
      oracle_code: (row.oracle_code as string) ?? '',
      status: row.status,
    })}
    buildCreatePayload={(v) => ({
      code: v.code,
      name: v.name,
      oracle_code: v.oracle_code || undefined,
    })}
    buildEditPayload={(v, id) => ({
      id,
      code: v.code,
      name: v.name,
      oracle_code: v.oracle_code || undefined,
    })}
  />
);

export default PaymentTermPage;
