import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_ENV } from '../../configs/env.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: APP_ENV.jwt.secret,
      // jsonwebtoken accepts strings like "12h" / "30d" at runtime, but the
      // newer types narrow this to its own template literal union — cast to
      // string to avoid forcing every consumer to pin a specific format.
      signOptions: { expiresIn: APP_ENV.jwt.expiresIn as unknown as number },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
