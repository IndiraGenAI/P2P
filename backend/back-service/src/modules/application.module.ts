import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

// NOTE: Legacy modules (departments, course, packages, areas, exam-portal/batch)
// were copied from another project but their dependencies (`@modules/branches`,
// `src/general-dto/.dto`, etc.) were never ported, so they fail to compile.
// They are intentionally disabled here until they're either fixed or removed.
// Re-enable them by re-importing once their imports are repaired.

export const ApplicationModules = [
  CommonModule,
  AuthModule,
  RolesModule,
  UsersModule,
];
