import { Ruler } from 'lucide-react';
import { MasterListPage } from '@/components/master/MasterListPage';
import { Common } from '@/utils/constants/constant';
import {
  createNewUom,
  editUomById,
  removeUomById,
  searchUomData,
  updateUomStatus,
} from '@/state/uom/uom.action';
import {
  clearUomMessage,
  uomMasterSelector,
} from '@/state/uom/uom.reducer';
import UomAdd from './Add';
import type { IUomRecord } from './Uom.model';

export const UomPage = () => (
  <MasterListPage<IUomRecord>
    pageCode={Common.Modules.MASTER.UOM}
    singularLabel="UOM"
    pluralLabel="UOMs"
    icon={Ruler}
    selector={uomMasterSelector}
    clearMessage={clearUomMessage}
    searchAction={searchUomData}
    createAction={createNewUom}
    editAction={editUomById}
    removeAction={removeUomById}
    updateStatusAction={updateUomStatus}
    AddForm={UomAdd}
    buildRecordFromRow={(row) => ({
      id: row.id,
      code: (row.code as string) ?? '',
      name: row.name,
      status: row.status,
    })}
    buildCreatePayload={(v) => ({ code: v.code, name: v.name })}
    buildEditPayload={(v, id) => ({ id, code: v.code, name: v.name })}
  />
);

export default UomPage;
