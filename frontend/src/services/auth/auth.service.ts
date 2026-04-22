import config from '@/utils/config';
import request from '@/axios/request';
import type { IApiResponse } from '@/utils/models/common';
import type {
  IAuthTokenPair,
  IAuthUser,
  ILoginPayload,
  IRegisterPayload,
} from './auth.model';

class AuthService {
  ENDPOINT = config.baseApiAuth + '/auth';




  public login = async (
    data: ILoginPayload,
  ): Promise<IApiResponse<IAuthTokenPair>> => {
    const url = `${this.ENDPOINT}/login`;
    return request({
      url,
      method: 'POST',
      data,
      headers: { 'no-auth': 'true' },
    }).then((res) => res.data);
  };

  public register = async (
    data: IRegisterPayload,
  ): Promise<IApiResponse<IAuthTokenPair>> => {
    const url = `${this.ENDPOINT}/register`;
    return request({
      url,
      method: 'POST',
      data,
      headers: { 'no-auth': 'true' },
    }).then((res) => res.data);
  };

  public me = async (): Promise<IApiResponse<IAuthUser>> => {
    const url = `${this.ENDPOINT}/me`;
    return request({ url, method: 'GET' }).then((res) => res.data);
  };
}

export default new AuthService();
