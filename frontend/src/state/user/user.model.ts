import type { IUser } from "src/services/user/user.model";

export interface IUserState {
  usersData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IUser;
  };
  createUsers: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  editById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  removeById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  updateById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
}
