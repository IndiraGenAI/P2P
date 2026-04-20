export interface IUserDataAll {
  user?: any;
}

export interface IAuthConfigs {
  cognitoUserId: { [key: string]: string };
  refreshToken: { [key: string]: string };
  accessToken: { [key: string]: string };
}
export interface ILoginFormField {
  email: string;
  password: string;
}

export interface IAuthResponse {
  status: string;
  user?: any;
  code?: string;
  email?: string;
  message?: string;
}

export interface IForgotPasswordFormField {
  email: string;
}

export interface IForgotPasswordChangeField extends IForgotPasswordFormField {
  code: string;
  password: string;
}

export interface IResetPasswordDTO {
  user: Record<string, any> | null;
  newPassword: string;
}

export interface IChangePasswordField {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}
export interface IStudentPortalVerify {
  mobile_no: string | undefined;
}
