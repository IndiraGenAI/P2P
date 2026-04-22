import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Users, UserStatus } from 'erp-db';
import { APP_ENV } from '../../configs/env.config';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { JwtPayload } from './jwt.strategy';

const BCRYPT_ROUNDS = 10;

export interface AuthSafeUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
}

export interface AuthTokenPair {
  accessToken: string;
  expiresIn: string;
  user: AuthSafeUser;
}

const toSafeUser = (user: Users): AuthSafeUser => ({
  id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  phone: user.phone ?? null,
  status: user.status,
});

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private signFor(user: Users): AuthTokenPair {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      expiresIn: APP_ENV.jwt.expiresIn,
      user: toSafeUser(user),
    };
  }

  async register(dto: RegisterDto): Promise<AuthTokenPair> {
    const email = dto.email.trim().toLowerCase();

    const existing = await UsersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException(
        `User with email "${email}" already exists`,
      );
    }

    const hash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = UsersRepository.create({
      first_name: dto.first_name.trim(),
      last_name: dto.last_name.trim(),
      email,
      hash,
      phone: dto.phone?.trim() ?? '',
      // Self-registered accounts go straight to ENABLE so the user can log in.
      // Tighten this to PENDING + an admin-approval flow later if needed.
      status: UserStatus.ENABLE,
      created_by: email,
    });

    const saved = await UsersRepository.save(user);
    return this.signFor(saved);
  }

  async login(dto: LoginDto): Promise<AuthTokenPair> {
    const email = dto.email.trim().toLowerCase();

    const user = await UsersRepository.findOne({
      where: { email },
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'hash',
        'phone',
        'status',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === UserStatus.DISABLE) {
      throw new UnauthorizedException(
        'Your account has been disabled. Please contact your administrator.',
      );
    }
    if (user.status === UserStatus.PENDING) {
      throw new UnauthorizedException(
        'Your account is pending approval. Please contact your administrator.',
      );
    }

    const ok = await bcrypt.compare(dto.password, user.hash);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password');
    }

    user.last_seen = new Date();
    await UsersRepository.save(user);

    return this.signFor(user);
  }

  async getProfile(userId: number): Promise<AuthSafeUser> {
    const user = await UsersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    return toSafeUser(user);
  }
}
