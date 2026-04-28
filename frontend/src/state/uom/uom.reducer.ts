import uomService, { type IUomRow } from '@/services/uom/uom.service';
import { createMasterSlice } from '../helpers/createMasterSlice';
import type { RootState } from '../store';

const uom = createMasterSlice<
  IUomRow,
  Partial<IUomRow>,
  Partial<IUomRow> & { id: number }
>('uomMaster', uomService);

export const {
  search: searchUomData,
  create: createNewUom,
  edit: editUomById,
  remove: removeUomById,
  updateStatus: updateUomStatus,
} = uom.actions;

export const clearUomMessage = uom.clearMessage;
export const uomMasterSelector = (state: RootState) => state.uomMaster;
export default uom.reducer;
