import request from "src/lib/axios/request";
import { config } from "src/utils";
import { IApiResponse } from "src/utils/models/common";
import { IPermission } from "src/pages/Permissions/Permission.model";

class RolePermissionsService {
  ENDPOINT = `${config.baseApiMasters}/role-permissions`;

  public saveRolePermissions = async (
    data: IPermission,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };
}

export default new RolePermissionsService();
