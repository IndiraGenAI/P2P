import { Layers } from 'lucide-react';
import { MasterListPage } from '@/components/master/MasterListPage';
import {
  SimpleCodeNameForm,
  type ISimpleCodeNameRecord,
} from '@/components/master/SimpleCodeNameForm';
import { Common } from '@/utils/constants/constant';
import {
  createNewItemCategory,
  editItemCategoryById,
  removeItemCategoryById,
  searchItemCategoryData,
  updateItemCategoryStatus,
} from '@/state/itemCategory/itemCategory.action';
import {
  clearItemCategoryMessage,
  itemCategoryMasterSelector,
} from '@/state/itemCategory/itemCategory.reducer';

const AddForm = (props: any) => (
  <SimpleCodeNameForm
    {...props}
    codePlaceholder="e.g. RAW"
    namePlaceholder="e.g. Raw Material"
    codeLabel="Code"
    nameLabel="Category Name"
  />
);

export const ItemCategoryPage = () => (
  <MasterListPage<ISimpleCodeNameRecord>
    pageCode={Common.Modules.MASTER.ITEM_CATEGORY}
    singularLabel="Item Category"
    pluralLabel="Item Categories"
    icon={Layers}
    selector={itemCategoryMasterSelector}
    clearMessage={clearItemCategoryMessage}
    searchAction={searchItemCategoryData}
    createAction={createNewItemCategory}
    editAction={editItemCategoryById}
    removeAction={removeItemCategoryById}
    updateStatusAction={updateItemCategoryStatus}
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

export default ItemCategoryPage;
