import itemService, { type IItemRow } from '@/services/item/item.service';
import { createMasterSlice } from '../helpers/createMasterSlice';
import type { RootState } from '../store';

const item = createMasterSlice<
  IItemRow,
  Partial<IItemRow>,
  Partial<IItemRow> & { id: number }
>('itemMaster', itemService);

export const {
  search: searchItemData,
  create: createNewItem,
  edit: editItemById,
  remove: removeItemById,
  updateStatus: updateItemStatus,
} = item.actions;

export const clearItemMessage = item.clearMessage;
export const itemMasterSelector = (state: RootState) => state.itemMaster;
export default item.reducer;
