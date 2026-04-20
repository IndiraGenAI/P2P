import { IForgotPasswordFormField } from "../../services/login/login.model";

export interface ILoginFormProps {
  onLogin: (email: string, password: string) => void;
  onChangeStage: (stage: number) => void;
  loading: boolean;
}

export interface IResetPasswordForm {
  password: string;
  newPassword: string;
  confirm: string;
  code?: string;
}

export interface IResetPasswordProps {
  stage: number;
  onChangePassword: (value: IResetPasswordForm) => void;
  isLoading: boolean;
}

export interface IForgotPasswordProps {
  onChangeStage: (stage: number) => void;
  onForgotPassword: (value: IForgotPasswordFormField) => void;
  isLoading: boolean;
}
