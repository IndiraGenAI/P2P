import type { IAuthUser } from 'src/services/auth/auth.model';

export interface IAuthState {
  login: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  register: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  profile: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IAuthUser | null;
  };
  accessToken: string | null;
}
