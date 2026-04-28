import { useEffect, useRef, useState } from 'react';
import { Building2 } from 'lucide-react';
import {
  MasterListPage,
  type IMasterRow,
} from '@/components/master/MasterListPage';
import { Common } from '@/utils/constants/constant';
import {
  clearVendorMessage,
  createNewVendor,
  editVendorById,
  vendorMasterSelector,
  removeVendorById,
  searchVendorData,
  updateVendorStatus,
} from '@/state/vendor/vendor.reducer';
import vendorCategoryService, {
  type IVendorCategoryRow,
} from '@/services/vendorCategory/vendorCategory.service';
import paymentTermService, {
  type IPaymentTermRow,
} from '@/services/paymentTerm/paymentTerm.service';
import applicantTypeService, {
  type IApplicantTypeRow,
} from '@/services/applicantType/applicantType.service';
import tdsService from '@/services/tds/tds.service';
import type { ITdsDetails } from '@/services/tds/tds.model';
import countryService from '@/services/country/country.service';
import currencyService from '@/services/currency/currency.service';
import type { SelectOption } from '@/common/models';
import VendorAdd from './Add';
import type { IVendorRecord } from './Vendor.model';

const useFkOptions = () => {
  const [vendorCategories, setVendorCategories] = useState<SelectOption[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<SelectOption[]>([]);
  const [applicantTypes, setApplicantTypes] = useState<SelectOption[]>([]);
  const [tdsList, setTdsList] = useState<SelectOption[]>([]);
  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [currencies, setCurrencies] = useState<SelectOption[]>([]);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    const params = new URLSearchParams();
    params.set('noLimit', 'true');
    params.set('status', 'true');

    vendorCategoryService.search(params).then((res) => {
      const rows = (res.data as { rows: IVendorCategoryRow[] }).rows ?? [];
      setVendorCategories(
        rows.map((r) => ({ value: String(r.id), label: r.name })),
      );
    });
    paymentTermService.search(params).then((res) => {
      const rows = (res.data as { rows: IPaymentTermRow[] }).rows ?? [];
      setPaymentTerms(
        rows.map((r) => ({ value: String(r.id), label: r.name })),
      );
    });
    applicantTypeService.search(params).then((res) => {
      const rows = (res.data as { rows: IApplicantTypeRow[] }).rows ?? [];
      setApplicantTypes(
        rows.map((r) => ({ value: String(r.id), label: r.name })),
      );
    });
    tdsService.searchTdsData(params).then((res) => {
      const rows = (res.data as { rows: ITdsDetails[] }).rows ?? [];
      setTdsList(
        rows.map((r) => ({
          value: String(r.id),
          label: `${r.code ?? ''} — ${r.name ?? ''}`,
        })),
      );
    });
    countryService
      .searchCountryData(Object.fromEntries(params))
      .then((res) => {
        const rows =
          ((res.data as unknown) as { rows?: { id: number; name: string }[] })
            ?.rows ?? [];
        setCountries(
          rows.map((r) => ({ value: String(r.id), label: r.name })),
        );
      })
      .catch(() => setCountries([]));
    currencyService
      .searchCurrencyData(Object.fromEntries(params))
      .then((res) => {
        const rows =
          ((res.data as unknown) as {
            rows?: { id: number; code?: string; name: string }[];
          })?.rows ?? [];
        setCurrencies(
          rows.map((r) => ({
            value: String(r.id),
            label: r.code ? `${r.code} — ${r.name}` : r.name,
          })),
        );
      })
      .catch(() => setCurrencies([]));
  }, []);

  return {
    vendorCategories,
    paymentTerms,
    applicantTypes,
    tdsList,
    countries,
    currencies,
  };
};

export const VendorPage = () => {
  const {
    vendorCategories,
    paymentTerms,
    applicantTypes,
    tdsList,
    countries,
    currencies,
  } = useFkOptions();

  const AddForm = (props: {
    data?: IVendorRecord;
    onSubmit: (val: IVendorRecord) => void;
    myRef?: React.Ref<HTMLButtonElement>;
  }) => (
    <VendorAdd
      data={props.data}
      onSubmit={props.onSubmit}
      myRef={props.myRef}
      vendorCategories={vendorCategories}
      paymentTerms={paymentTerms}
      applicantTypes={applicantTypes}
      tdsList={tdsList}
      countries={countries}
      currencies={currencies}
    />
  );

  return (
    <MasterListPage<IVendorRecord>
      pageCode={Common.Modules.MASTER.VENDOR}
      singularLabel="Vendor"
      pluralLabel="Vendors"
      icon={Building2}
      selector={vendorMasterSelector}
      clearMessage={clearVendorMessage}
      searchAction={searchVendorData}
      createAction={createNewVendor}
      editAction={editVendorById}
      removeAction={removeVendorById}
      updateStatusAction={updateVendorStatus}
      AddForm={AddForm}
      formSize="xl"
      extraColumns={[
        {
          key: 'vendor_category',
          label: 'Category',
          render: (row: IMasterRow) => {
            const c = row.vendor_category as { name?: string } | null;
            return c?.name ?? <span className="text-xs text-gray-400">—</span>;
          },
        },
        {
          key: 'vendor_type',
          label: 'Type',
          render: (row: IMasterRow) =>
            (row.vendor_type as string) || (
              <span className="text-xs text-gray-400">—</span>
            ),
        },
        {
          key: 'pan_number',
          label: 'PAN',
          render: (row: IMasterRow) =>
            (row.pan_number as string) || (
              <span className="text-xs text-gray-400">—</span>
            ),
        },
      ]}
      buildRecordFromRow={(row) => ({
        id: row.id,
        code: (row.code as string) ?? '',
        name: row.name,
        vendor_category_id: (row.vendor_category_id as number) ?? null,
        supplier_number: (row.supplier_number as string) ?? '',
        supplier_name: (row.supplier_name as string) ?? '',
        tds_id: (row.tds_id as number) ?? null,
        payment_term_id: (row.payment_term_id as number) ?? null,
        applicant_type_id: (row.applicant_type_id as number) ?? null,
        resident_status: (row.resident_status as string) ?? '',
        pan_number: (row.pan_number as string) ?? '',
        gst_number: (row.gst_number as string) ?? '',
        country_code: (row.country_code as string) ?? '',
        vendor_type: (row.vendor_type as string) ?? '',
        is_msme: (row.is_msme as boolean) ?? false,
        address_line1: (row.address_line1 as string) ?? '',
        address_line2: (row.address_line2 as string) ?? '',
        address_line3: (row.address_line3 as string) ?? '',
        state_code: (row.state_code as string) ?? '',
        city: (row.city as string) ?? '',
        pincode: (row.pincode as string) ?? '',
        country_id: (row.country_id as number) ?? null,
        currency_id: (row.currency_id as number) ?? null,
        contact_first_name: (row.contact_first_name as string) ?? '',
        contact_last_name: (row.contact_last_name as string) ?? '',
        contact_phone: (row.contact_phone as string) ?? '',
        contact_email: (row.contact_email as string) ?? '',
        status: row.status,
      })}
      buildCreatePayload={(v) => ({
        ...v,
        id: undefined,
      })}
      buildEditPayload={(v, id) => ({
        ...v,
        id,
      })}
    />
  );
};

export default VendorPage;
