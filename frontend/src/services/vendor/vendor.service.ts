import { createMasterService } from '../helpers/createMasterService';

export interface IVendorRow {
  id: number;
  code?: string | null;
  name: string;
  vendor_category_id?: number | null;
  supplier_number?: string | null;
  supplier_name?: string | null;
  tds_id?: number | null;
  payment_term_id?: number | null;
  applicant_type_id?: number | null;
  resident_status?: string | null;
  pan_number?: string | null;
  gst_number?: string | null;
  country_code?: string | null;
  vendor_type?: string | null;
  is_msme?: boolean | null;
  address_line1?: string | null;
  address_line2?: string | null;
  address_line3?: string | null;
  state_code?: string | null;
  city?: string | null;
  pincode?: string | null;
  country_id?: number | null;
  currency_id?: number | null;
  contact_first_name?: string | null;
  contact_last_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  status?: boolean;
  vendor_category?: { id: number; code: string; name: string } | null;
  tds?: { id: number; code: string; name: string } | null;
  payment_term?: { id: number; code: string; name: string } | null;
  applicant_type?: { id: number; code: string; name: string } | null;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

const vendorService = createMasterService<IVendorRow>('/vendor');

export default vendorService;
