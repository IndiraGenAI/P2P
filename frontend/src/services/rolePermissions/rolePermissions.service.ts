import config from '@/utils/config';
import request from '@/axios/request';
import type { IApiResponse } from '@/utils/models/common';
import type {
  ISaveRolePermissionsPayload,
  ISaveRolePermissionsResponse,
} from './rolePermissions.model';

class RolePermissionsService {
  ENDPOINT = config.baseApiAuth + '/role-permissions';

  public save = async (
    data: ISaveRolePermissionsPayload,
  ): Promise<IApiResponse<ISaveRolePermissionsResponse>> => {
    return request({
      url: this.ENDPOINT,
      method: 'POST',
      data,
    }).then((res) => res.data);
  };
}

export default new RolePermissionsService();
