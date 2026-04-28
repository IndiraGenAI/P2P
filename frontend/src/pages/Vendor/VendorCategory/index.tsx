import { Tag } from 'lucide-react';
import { MasterListPage } from '@/components/master/MasterListPage';
import {
  SimpleCodeNameForm,
  type ISimpleCodeNameRecord,
} from '@/components/master/SimpleCodeNameForm';
import { Common } from '@/utils/constants/constant';
import {
  createNewVendorCategory,
  editVendorCategoryById,
  removeVendorCategoryById,
  searchVendorCategoryData,
  updateVendorCategoryStatus,
} from '@/state/vendorCategory/vendorCategory.action';
import {
  clearVendorCategoryMessage,
  vendorCategoryMasterSelector,
} from '@/state/vendorCategory/vendorCategory.reducer';

const AddForm = (props: any) => (
  <SimpleCodeNameForm
    {...props}
    codePlaceholder="e.g. SUP"
    namePlaceholder="e.g. Supplier"
    codeLabel="Code"
    nameLabel="Category Name"
  />
);

export const VendorCategoryPage = () => (
  <MasterListPage<ISimpleCodeNameRecord>
    pageCode={Common.Modules.MASTER.VENDOR_CATEGORY}
    singularLabel="Vendor Category"
    pluralLabel="Vendor Categories"
    icon={Tag}
    selector={vendorCategoryMasterSelector}
    clearMessage={clearVendorCategoryMessage}
    searchAction={searchVendorCategoryData}
    createAction={createNewVendorCategory}
    editAction={editVendorCategoryById}
    removeAction={removeVendorCategoryById}
    updateStatusAction={updateVendorCategoryStatus}
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

export default VendorCategoryPage;
