import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  getBranchIds,
  getZoneWiseSubZonesDataByZoneID,
} from 'src/commons/helper';
import { dataSource } from '../data-source';
import { zonesRepository } from '@modules/branches/branch.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const skip = this.reflector.get<string[]>('skipAuth', context.getHandler());
    if (skip) {
      return true;
    }
    if (+request.headers.userroleid) {
      const data = await dataSource.query(
        `select * from get_user_role_wise_permission('${+request.headers
          .userroleid}')`,
      );
      if (
        data[0] &&
        +request.headers.userId &&
        +request.headers.userId === data[0].user_id
      ) {
        let zone = await zonesRepository.find({
          select: ['id', 'parent_id', 'type'],
        });
        let zoneIds = getZoneWiseSubZonesDataByZoneID(zone, data[0].zone_id);
        let branchIds = [];
        branchIds = await getBranchIds(zoneIds);
        const { headers } = request;
        headers.branchIds = branchIds as string | string[];
        if (!roles || roles.length === 0) {
          return true;
        }
        if (roles) {
          return data[0].permissions.some((role) => roles.includes(role));
        }
      }
    }
    return false;
  }
}

export const Role = (...roles: string[]) => SetMetadata('roles', roles);
export const SkipAuth = () => SetMetadata('skipAuth', true);
