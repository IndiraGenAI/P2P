export interface IAuthRolePermission {
  page_action?: {
    id?: number;
    tag?: string;
    page?: { id?: number; page_code?: string; name?: string };
    action?: { id?: number; action_code?: string; name?: string };
  };
}

export interface IAuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
  role_permissions?: IAuthRolePermission[];
}

export interface IAuthTokenPair {
  accessToken: string;
  expiresIn: string;
  user: IAuthUser;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
}
