import { ListTree } from 'lucide-react';
import { MasterListPage } from '@/components/master/MasterListPage';
import {
  SimpleCodeNameForm,
  type ISimpleCodeNameRecord,
} from '@/components/master/SimpleCodeNameForm';
import { Common } from '@/utils/constants/constant';
import {
  clearItemTypeMessage,
  createNewItemType,
  editItemTypeById,
  itemTypeMasterSelector,
  removeItemTypeById,
  searchItemTypeData,
  updateItemTypeStatus,
} from '@/state/itemType/itemType.reducer';

const AddForm = (props: any) => (
  <SimpleCodeNameForm
    {...props}
    codePlaceholder="e.g. SVC"
    namePlaceholder="e.g. Service"
    codeLabel="Code"
    nameLabel="Type Name"
  />
);

export const ItemTypePage = () => (
  <MasterListPage<ISimpleCodeNameRecord>
    pageCode={Common.Modules.MASTER.ITEM_TYPE}
    singularLabel="Item Type"
    pluralLabel="Item Types"
    icon={ListTree}
    selector={itemTypeMasterSelector}
    clearMessage={clearItemTypeMessage}
    searchAction={searchItemTypeData}
    createAction={createNewItemType}
    editAction={editItemTypeById}
    removeAction={removeItemTypeById}
    updateStatusAction={updateItemTypeStatus}
    AddForm={AddForm}
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

export default ItemTypePage;
