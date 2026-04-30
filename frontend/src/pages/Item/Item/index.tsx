import { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { Package } from 'lucide-react';
import {
  MasterListPage,
  type IMasterRow,
} from '@/components/master/MasterListPage';
import { Common } from '@/utils/constants/constant';
import {
  bulkUploadItems,
  createNewItem,
  editItemById,
  removeItemById,
  searchItemData,
  updateItemStatus,
} from '@/state/item/item.action';
import {
  clearItemMessage,
  itemMasterSelector,
} from '@/state/item/item.reducer';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import BulkUploadButton from '@/components/master/BulkUploadButton';
import itemTypeService, {
  type IItemTypeRow,
} from '@/services/itemType/itemType.service';
import itemCategoryService, {
  type IItemCategoryRow,
} from '@/services/itemCategory/itemCategory.service';
import uomService, { type IUomRow } from '@/services/uom/uom.service';
import coaService from '@/services/coa/coa.service';
import type { ICoaDetails } from '@/services/coa/coa.model';
import type { SelectOption } from '@/common/models';
import ItemAdd from './Add';
import type { IItemRecord } from './Item.model';

const useFkOptions = () => {
  const [itemTypes, setItemTypes] = useState<SelectOption[]>([]);
  const [itemCategories, setItemCategories] = useState<SelectOption[]>([]);
  const [uoms, setUoms] = useState<SelectOption[]>([]);
  const [coas, setCoas] = useState<SelectOption[]>([]);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    const params = new URLSearchParams();
    params.set('noLimit', 'true');
    params.set('status', 'true');

    itemTypeService.search(params).then((res) => {
      const rows = (res.data as { rows: IItemTypeRow[] }).rows ?? [];
      setItemTypes(rows.map((r) => ({ value: String(r.id), label: r.name })));
    });
    itemCategoryService.search(params).then((res) => {
      const rows = (res.data as { rows: IItemCategoryRow[] }).rows ?? [];
      setItemCategories(
        rows.map((r) => ({ value: String(r.id), label: r.name })),
      );
    });
    uomService.search(params).then((res) => {
      const rows = (res.data as { rows: IUomRow[] }).rows ?? [];
      setUoms(rows.map((r) => ({ value: String(r.id), label: r.name })));
    });
    coaService.searchCoaData(params).then((res) => {
      const rows = (res.data as { rows: ICoaDetails[] }).rows ?? [];
      setCoas(
        rows.map((r) => ({
          value: String(r.id),
          label: `${r.gl_code} — ${r.gl_name}`,
        })),
      );
    });
  }, []);

  return { itemTypes, itemCategories, uoms, coas };
};

const ITEM_SAMPLE_HEADERS = [
  'Code',
  'Name',
  'Item Type',
  'Item Category',
  'UOM',
  'COA Code',
  'Status',
];

export const ItemPage = () => {
  const { itemTypes, itemCategories, uoms, coas } = useFkOptions();
  const dispatch = useAppDispatch();
  const bulkUploadState = useAppSelector(
    (s) => itemMasterSelector(s).bulkUpload,
  );

  useEffect(() => {
    if (!bulkUploadState.message) return;
    if (bulkUploadState.hasErrors) {
      message.error(bulkUploadState.message);
    } else {
      message.success(bulkUploadState.message);
    }
    dispatch(clearItemMessage());
  }, [bulkUploadState.message, bulkUploadState.hasErrors, dispatch]);

  const AddForm = (props: any) => (
    <ItemAdd
      {...props}
      itemTypes={itemTypes}
      itemCategories={itemCategories}
      uoms={uoms}
      coas={coas}
    />
  );

  return (
    <MasterListPage<IItemRecord>
      pageCode={Common.Modules.MASTER.ITEM}
      singularLabel="Item"
      pluralLabel="Items"
      icon={Package}
      selector={itemMasterSelector}
      clearMessage={clearItemMessage}
      searchAction={searchItemData}
      createAction={createNewItem}
      editAction={editItemById}
      removeAction={removeItemById}
      updateStatusAction={updateItemStatus}
      AddForm={AddForm}
      headerActions={({ refresh }) => (
        <BulkUploadButton
          label="Bulk Upload Items"
          sampleFileName="item_master_sample.csv"
          sampleHeaders={ITEM_SAMPLE_HEADERS}
          onUpload={(file) => dispatch(bulkUploadItems(file)).unwrap()}
          onUploaded={refresh}
        />
      )}
      extraColumns={[
        {
          key: 'item_type',
          label: 'Type',
          render: (row: IMasterRow) => {
            const t = row.item_type as { name?: string } | null;
            return t?.name ?? <span className="text-xs text-gray-400">—</span>;
          },
        },
        {
          key: 'item_category',
          label: 'Category',
          render: (row: IMasterRow) => {
            const c = row.item_category as { name?: string } | null;
            return c?.name ?? <span className="text-xs text-gray-400">—</span>;
          },
        },
        {
          key: 'uom',
          label: 'UOM',
          render: (row: IMasterRow) => {
            const u = row.uom as { name?: string } | null;
            return u?.name ?? <span className="text-xs text-gray-400">—</span>;
          },
        },
      ]}
      buildRecordFromRow={(row) => ({
        id: row.id,
        code: (row.code as string) ?? '',
        name: row.name,
        item_type_id: (row.item_type_id as number) ?? null,
        item_category_id: (row.item_category_id as number) ?? null,
        uom_id: (row.uom_id as number) ?? null,
        coa_id: (row.coa_id as number) ?? null,
        status: row.status,
      })}
      buildCreatePayload={(v) => ({
        code: v.code,
        name: v.name,
        item_type_id: v.item_type_id ?? undefined,
        item_category_id: v.item_category_id ?? undefined,
        uom_id: v.uom_id ?? undefined,
        coa_id: v.coa_id ?? undefined,
      })}
      buildEditPayload={(v, id) => ({
        id,
        code: v.code,
        name: v.name,
        item_type_id: v.item_type_id ?? undefined,
        item_category_id: v.item_category_id ?? undefined,
        uom_id: v.uom_id ?? undefined,
        coa_id: v.coa_id ?? undefined,
      })}
    />
  );
};

export default ItemPage;
