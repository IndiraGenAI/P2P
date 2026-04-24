import { AuthModule } from './auth/auth.module';
import { CenterModule } from './center/center.module';
import { CityModule } from './city/city.module';
import { CoaModule } from './coa/coa.module';
import { CoaCategoryModule } from './coa-category/coa-category.module';
import { CommonModule } from './common/common.module';
import { CostCenterModule } from './cost-center/cost-center.module';
import { CountryModule } from './country/country.module';
import { CurrencyModule } from './currency/currency.module';
import { DepartmentModule } from './department/department.module';
import { EntityModule } from './entity/entity.module';
import { GstModule } from './gst/gst.module';
import { InvoiceSourceModule } from './invoice-source/invoice-source.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { RolesModule } from './roles/roles.module';
import { StateModule } from './state/state.module';
import { SubdepartmentModule } from './subdepartment/subdepartment.module';
import { TdsModule } from './tds/tds.module';
import { UsersModule } from './users/users.module';
import { VoucherModule } from './voucher/voucher.module';
import { ZoneModule } from './zone/zone.module';

export const ApplicationModules = [
  CommonModule,
  AuthModule,
  RolesModule,
  RolePermissionsModule,
  UsersModule,
  CountryModule,
  StateModule,
  CityModule,
  ZoneModule,
  DepartmentModule,
  SubdepartmentModule,
  CostCenterModule,
  CenterModule,
  EntityModule,
  InvoiceSourceModule,
  CurrencyModule,
  VoucherModule,
  GstModule,
  TdsModule,
  CoaCategoryModule,
  CoaModule,
];
