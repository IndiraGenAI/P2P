import itemCategoryService, {
  type IItemCategoryRow,
} from '@/services/itemCategory/itemCategory.service';
import { createMasterSlice } from '../helpers/createMasterSlice';
import type { RootState } from '../store';

const itemCategory = createMasterSlice<
  IItemCategoryRow,
  Partial<IItemCategoryRow>,
  Partial<IItemCategoryRow> & { id: number }
>('itemCategoryMaster', itemCategoryService);

export const {
  search: searchItemCategoryData,
  create: createNewItemCategory,
  edit: editItemCategoryById,
  remove: removeItemCategoryById,
  updateStatus: updateItemCategoryStatus,
} = itemCategory.actions;

export const clearItemCategoryMessage = itemCategory.clearMessage;
export const itemCategoryMasterSelector = (state: RootState) =>
  state.itemCategoryMaster;
export default itemCategory.reducer;
