import { FileSignature } from 'lucide-react';
import { MasterListPage } from '@/components/master/MasterListPage';
import { Common } from '@/utils/constants/constant';
import { showTooltip } from '@/utils/helperFunction';
import {
  createNewTermsCondition,
  editTermsConditionById,
  removeTermsConditionById,
  searchTermsConditionData,
  updateTermsConditionStatus,
} from '@/state/termsCondition/termsCondition.action';
import {
  clearTermsConditionMessage,
  termsConditionMasterSelector,
} from '@/state/termsCondition/termsCondition.reducer';
import { type ITermsConditionRow } from '@/services/termsCondition/termsCondition.service';
import TermsConditionAdd from './Add';
import type { ITermsConditionRecord } from './TermsCondition.model';

export const TermsConditionPage = () => (
  <MasterListPage<ITermsConditionRecord, ITermsConditionRow>
    pageCode={Common.Modules.MASTER.TERMS_CONDITIONS}
    singularLabel="Terms & Condition"
    pluralLabel="Terms & Conditions"
    icon={FileSignature}
    selector={termsConditionMasterSelector}
    clearMessage={clearTermsConditionMessage}
    searchAction={searchTermsConditionData}
    createAction={createNewTermsCondition}
    editAction={editTermsConditionById}
    removeAction={removeTermsConditionById}
    updateStatusAction={updateTermsConditionStatus}
    AddForm={TermsConditionAdd}
    extraColumns={[
      {
        key: 'description',
        label: 'Description',
        render: (row) => {
          const desc = row.description ?? '';
          if (!desc) {
            return <span className="text-xs text-gray-400">—</span>;
          }
          return showTooltip(desc, 50);
        },
      },
    ]}
    buildRecordFromRow={(row) => ({
      id: row.id,
      code: (row.code as string) ?? '',
      name: row.name,
      description: (row.description as string) ?? '',
      status: row.status,
    })}
    buildCreatePayload={(v) => ({
      code: v.code,
      name: v.name,
      description: v.description || undefined,
    })}
    buildEditPayload={(v, id) => ({
      id,
      code: v.code,
      name: v.name,
      description: v.description ?? '',
    })}
  />
);

export default TermsConditionPage;
