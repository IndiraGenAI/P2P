import { AuthModule } from './auth/auth.module';
import { PurchaseRequestModule } from './purchase-request/purchase-request.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { RateContractModule } from './rate-contract/rate-contract.module';
import { GrnModule } from './grn/grn.module';
import { GrnInvoiceModule } from './grn-invoice/grn-invoice.module';

/**
 * Register your business modules here. `AuthModule` is included by default so
 * the JWT auth + login/register endpoints work out of the box. Add new modules
 * to this array as you build them under `src/modules/<your-module>/`.
 */
export const ApplicationModules = [
  AuthModule,
  PurchaseRequestModule,
  PurchaseOrderModule,
  RateContractModule,
  GrnModule,
  GrnInvoiceModule,
];
