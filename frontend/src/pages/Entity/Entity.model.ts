export interface IEntityRecord {
  id: number;
  code: string;
  name: string;
  business_unit?: string | null;
  legal_entity?: string | null;
  liability_distribution?: string | null;
  prepayment_distribution?: string | null;
  shipping_addresses?: string[] | null;
  billing_addresses?: string[] | null;
  status?: boolean;
}
