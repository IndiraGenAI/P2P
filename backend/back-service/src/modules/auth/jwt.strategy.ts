import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { APP_ENV } from '../../configs/env.config';
import { UsersRepository } from '../users/users.repository';

export interface JwtPayload {
  sub: number;
  email: string;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: APP_ENV.jwt.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await UsersRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'email', 'first_name', 'last_name', 'status'],
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    if (user.status === 'DISABLE') {
      throw new UnauthorizedException('Account is disabled');
    }

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };
  }
}
