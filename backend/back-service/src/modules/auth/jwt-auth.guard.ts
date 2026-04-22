import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Standard passport-jwt guard. Apply with `@UseGuards(JwtAuthGuard)` on any
 * controller method that requires a valid Bearer token.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
