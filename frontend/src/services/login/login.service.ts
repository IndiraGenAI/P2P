import { Auth } from "aws-amplify";
import { trackPromise } from "react-promise-tracker";
import { Common } from "../../utils/constants/ActionTypes";
import {
  IAuthResponse,
  IForgotPasswordFormField,
  IForgotPasswordChangeField,
  IChangePasswordField,
  IResetPasswordDTO,
  ILoginFormField,
  IStudentPortalVerify,
} from "./login.model";
import request from "src/lib/axios/request";
import { config } from "src/utils";
import { IApiResponse } from "src/utils/models/common";

class LoginService {
  ENDPOINT = config.baseApiApplication + "/user";
  getCognitoUser = async (configs: any) => {
    return await trackPromise(Auth.currentAuthenticatedUser(configs));
  };

  // login = async (data: ILoginFormField): Promise<IUserData> => {
  //   const res = await trackPromise(
  //     Auth.signIn(data.email.toLowerCase(), data.password)
  //   );
  //   return Promise.resolve(res);
  // };

  logout = async () => {
    try {
      const data = await trackPromise(Auth.signOut());
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  authUser = async (data: ILoginFormField): Promise<IAuthResponse> => {
    try {
      let response: IAuthResponse;
      const user = await trackPromise(
        Auth.signIn(data.email.toLowerCase(), data.password)
      );
      if (
        user.challengeName === Common.AuthChallengeName.NEW_PASSWORD_REQUIRED
      ) {
        response = {
          status: Common.AuthChallengeName.NEW_PASSWORD_REQUIRED,
          user,
          email: data.email.toLowerCase(),
        };
      } else if (user.challengeName === Common.AuthChallengeName.MFA_SETUP) {
        const code = await trackPromise(Auth.setupTOTP(user));
        response = {
          status: Common.AuthChallengeName.MFA_SETUP,
          user,
          code,
          email: data.email.toLowerCase(),
        };
      } else if (
        user.challengeName === Common.AuthChallengeName.SOFTWARE_TOKEN_MFA
      ) {
        response = {
          status: Common.AuthChallengeName.SOFTWARE_TOKEN_MFA,
          user,
        };
      } else {
        response = {
          status: Common.AuthChallengeName.SUCCESS,
          user,
          message: "You are logged in successfully",
        };
      }
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  forgotPassword = async (
    data: IForgotPasswordFormField
  ): Promise<IAuthResponse> => {
    try {
      await trackPromise(Auth.forgotPassword(data.email.toLowerCase()));
      return Promise.resolve({ status: Common.AuthChallengeName.SUCCESS });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  forgotPasswordChange = async (
    data: IForgotPasswordChangeField
  ): Promise<IAuthResponse> => {
    try {
      if (data) {
        await trackPromise(
          Auth.forgotPasswordSubmit(
            data.email.toLowerCase(),
            data.code,
            data.password
          )
        );
      }
      return Promise.resolve({ status: Common.AuthChallengeName.SUCCESS });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  forcePasswordChange = async (
    data: IResetPasswordDTO
  ): Promise<IAuthResponse> => {
    try {
      let response: IAuthResponse;
      const user = await trackPromise(
        Auth.completeNewPassword(data.user, data.newPassword, null)
      );
      // set change password notification
      if (user.challengeName === Common.AuthChallengeName.MFA_SETUP) {
        const code = await trackPromise(Auth.setupTOTP(user));
        response = { status: Common.AuthChallengeName.MFA_SETUP, user, code };
      } else if (
        user.challengeName === Common.AuthChallengeName.SOFTWARE_TOKEN_MFA
      ) {
        response = {
          status: Common.AuthChallengeName.SOFTWARE_TOKEN_MFA,
          user,
        };
      } else {
        response = { status: Common.AuthChallengeName.SUCCESS, user };
      }
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  authVerifyCodeTotp = async (
    user: any,
    code: string
  ): Promise<IAuthResponse> => {
    try {
      await Auth.verifyTotpToken(user, code)
        .then(async () => {
          // don't forget to set TOTP as the preferred MFA method
          await Auth.setPreferredMFA(user, "TOTP");
          const signUserSession = await Auth.currentSession();
          user.setSignInUserSession(signUserSession);
        })
        .catch((e) => {
          Promise.reject(e);
        });

      return Promise.resolve({
        status: Common.AuthChallengeName.SUCCESS,
        user,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  verifyCodeOTP = async (user: any, code: string): Promise<IAuthResponse> => {
    try {
      user = await trackPromise(
        Auth.confirmSignIn(
          user,
          code,
          Common.AuthChallengeName.SOFTWARE_TOKEN_MFA
        )
      );
      return Promise.resolve({
        status: Common.AuthChallengeName.SUCCESS,
        user,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  changePassword = async (data: IChangePasswordField): Promise<any> => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      await trackPromise(
        Auth.changePassword(user, data.currentPassword, data.newPassword)
      );
      return Promise.resolve({ status: Common.AuthChallengeName.SUCCESS });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getCurrentMFAType = async (): Promise<any> => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const result = await Auth.getPreferredMFA(user, { bypassCache: true });
      return Promise.resolve({
        status: Common.AuthChallengeName.SUCCESS,
        data: result,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  setMFAAuthentication = async (isMFA: boolean): Promise<any> => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      let result = null;
      if (isMFA) {
        result = await Auth.setupTOTP(user);
      } else {
        result = await Auth.setPreferredMFA(user, Common.Auth.NOMFA);
      }
      return Promise.resolve({
        status: Common.AuthChallengeName.SUCCESS,
        data: result,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  setMFASecurityCodeVerify = async (code: string): Promise<any> => {
    try {
      const user = await trackPromise(Auth.currentAuthenticatedUser());
      await trackPromise(Auth.verifyTotpToken(user, code));
      await trackPromise(Auth.setPreferredMFA(user, "TOTP"));
      return Promise.resolve({ status: Common.AuthChallengeName.SUCCESS });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  studentPortal = async (
    data: IStudentPortalVerify
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}/student-portal`;
    return request({ url, method: "POST", data }).then((res) => {
      return res.data;
    });
  };
}

export default new LoginService();
