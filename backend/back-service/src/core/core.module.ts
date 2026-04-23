import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { APP_ENV } from '../configs/env.config';
import { RolesGuard } from './guards/role.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: APP_ENV.jwt.secret,
      signOptions: { expiresIn: APP_ENV.jwt.expiresIn as unknown as number },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [],
})
export class CoreModule {}
