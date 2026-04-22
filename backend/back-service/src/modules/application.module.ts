import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

export const ApplicationModules = [
  CommonModule,
  AuthModule,
  RolesModule,
  RolePermissionsModule,
  UsersModule,
];
