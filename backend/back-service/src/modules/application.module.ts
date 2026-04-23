import { AuthModule } from './auth/auth.module';
import { CityModule } from './city/city.module';
import { CommonModule } from './common/common.module';
import { CountryModule } from './country/country.module';
import { DepartmentModule } from './department/department.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { RolesModule } from './roles/roles.module';
import { StateModule } from './state/state.module';
import { SubdepartmentModule } from './subdepartment/subdepartment.module';
import { UsersModule } from './users/users.module';
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
];
