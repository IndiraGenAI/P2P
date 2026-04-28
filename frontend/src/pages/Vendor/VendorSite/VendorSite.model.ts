export interface IVendorSiteRecord {
  id: number;
  vendor_id: number;
  site_code: string;
  site_name?: string;
  address?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  supplier_site_name?: string;
  oracle_address_name?: string;
  status?: boolean;
}
