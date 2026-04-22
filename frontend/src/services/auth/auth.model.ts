export interface IAuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
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
