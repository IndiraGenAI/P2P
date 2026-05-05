-- Rate contract: ship/bill lines stored from entity master address lists (see entities.shipping_addresses / billing_addresses).
ALTER TABLE rate_contracts ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE rate_contracts ADD COLUMN IF NOT EXISTS billing_address TEXT;
