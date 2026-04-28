import itemTypeService, {
  type IItemTypeRow,
} from '@/services/itemType/itemType.service';
import { createMasterSlice } from '../helpers/createMasterSlice';
import type { RootState } from '../store';

const itemType = createMasterSlice<
  IItemTypeRow,
  Partial<IItemTypeRow>,
  Partial<IItemTypeRow> & { id: number }
>('itemTypeMaster', itemTypeService);

export const {
  search: searchItemTypeData,
  create: createNewItemType,
  edit: editItemTypeById,
  remove: removeItemTypeById,
  updateStatus: updateItemTypeStatus,
} = itemType.actions;

export const clearItemTypeMessage = itemType.clearMessage;
export const itemTypeMasterSelector = (state: RootState) =>
  state.itemTypeMaster;
export default itemType.reducer;
