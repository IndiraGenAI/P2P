import { createMasterService } from '../helpers/createMasterService';

export interface IVendorSiteRow {
  id: number;
  vendor_id: number;
  site_code: string;
  site_name?: string | null;
  address?: string | null;
  contact_person?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  supplier_site_name?: string | null;
  oracle_address_name?: string | null;
  status?: boolean;
  vendor?: { id: number; code: string; name: string } | null;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
  code?: string;
  name?: string;
}

const vendorSiteService = createMasterService<IVendorSiteRow>('/vendor/site');
export default vendorSiteService;
