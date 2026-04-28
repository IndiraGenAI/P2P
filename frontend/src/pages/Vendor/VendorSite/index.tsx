import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import {
  MasterListPage,
  type IMasterRow,
} from '@/components/master/MasterListPage';
import { Common } from '@/utils/constants/constant';
import {
  clearVendorSiteMessage,
  createNewVendorSite,
  editVendorSiteById,
  vendorSiteMasterSelector,
  removeVendorSiteById,
  searchVendorSiteData,
  updateVendorSiteStatus,
} from '@/state/vendorSite/vendorSite.reducer';
import vendorService, {
  type IVendorRow,
} from '@/services/vendor/vendor.service';
import type { SelectOption } from '@/common/models';
import VendorSiteAdd from './Add';
import type { IVendorSiteRecord } from './VendorSite.model';

const useFkOptions = () => {
  const [vendors, setVendors] = useState<SelectOption[]>([]);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    const params = new URLSearchParams();
    params.set('noLimit', 'true');
    params.set('status', 'true');
    vendorService.search(params).then((res) => {
      const rows = (res.data as { rows: IVendorRow[] }).rows ?? [];
      setVendors(
        rows.map((r) => ({
          value: String(r.id),
          label: r.code ? `${r.code} — ${r.name}` : r.name,
        })),
      );
    });
  }, []);

  return { vendors };
};

export const VendorSitePage = () => {
  const { vendors } = useFkOptions();

  const AddForm = (props: any) => (
    <VendorSiteAdd {...props} vendors={vendors} />
  );

  return (
    <MasterListPage<IVendorSiteRecord>
      pageCode={Common.Modules.MASTER.VENDOR_SITE}
      singularLabel="Vendor Site"
      pluralLabel="Vendor Sites"
      icon={MapPin}
      selector={vendorSiteMasterSelector}
      clearMessage={clearVendorSiteMessage}
      searchAction={searchVendorSiteData}
      createAction={createNewVendorSite}
      editAction={editVendorSiteById}
      removeAction={removeVendorSiteById}
      updateStatusAction={updateVendorSiteStatus}
      AddForm={AddForm}
      showCodeColumn={false}
      extraColumns={[
        {
          key: 'site_code',
          label: 'Site Code',
          render: (row: IMasterRow) => (
            <span className="inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {row.site_code as string}
            </span>
          ),
        },
        {
          key: 'vendor',
          label: 'Vendor',
          render: (row: IMasterRow) => {
            const v = row.vendor as { name?: string } | null;
            return v?.name ?? <span className="text-xs text-gray-400">—</span>;
          },
        },
        {
          key: 'contact_person',
          label: 'Contact',
          render: (row: IMasterRow) =>
            (row.contact_person as string) || (
              <span className="text-xs text-gray-400">—</span>
            ),
        },
      ]}
      buildRecordFromRow={(row) => ({
        id: row.id,
        vendor_id: (row.vendor_id as number) ?? 0,
        site_code: (row.site_code as string) ?? '',
        site_name: (row.site_name as string) ?? '',
        address: (row.address as string) ?? '',
        contact_person: (row.contact_person as string) ?? '',
        contact_phone: (row.contact_phone as string) ?? '',
        contact_email: (row.contact_email as string) ?? '',
        supplier_site_name: (row.supplier_site_name as string) ?? '',
        oracle_address_name: (row.oracle_address_name as string) ?? '',
        status: row.status,
      })}
      buildCreatePayload={(v) => ({
        vendor_id: v.vendor_id,
        site_code: v.site_code,
        site_name: v.site_name,
        address: v.address,
        contact_person: v.contact_person,
        contact_phone: v.contact_phone,
        contact_email: v.contact_email,
        supplier_site_name: v.supplier_site_name,
        oracle_address_name: v.oracle_address_name,
      })}
      buildEditPayload={(v, id) => ({
        id,
        vendor_id: v.vendor_id,
        site_code: v.site_code,
        site_name: v.site_name,
        address: v.address,
        contact_person: v.contact_person,
        contact_phone: v.contact_phone,
        contact_email: v.contact_email,
        supplier_site_name: v.supplier_site_name,
        oracle_address_name: v.oracle_address_name,
      })}
    />
  );
};

export default VendorSitePage;
