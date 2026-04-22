
export const TOGGLE_COLLAPSED_NAV = "TOGGLE_COLLAPSE_MENU";
export const WINDOW_WIDTH = "WINDOW-WIDTH";
export const SWITCH_LANGUAGE = "SWITCH-LANGUAGE";


export const FETCH_START = "fetch_start";
export const FETCH_SUCCESS = "fetch_success";
export const FETCH_ERROR = "fetch_error";
export const SHOW_MESSAGE = "SHOW_MESSAGE";
export const HIDE_MESSAGE = "HIDE_MESSAGE";
export const ON_SHOW_LOADER = "ON_SHOW_LOADER";
export const ON_HIDE_LOADER = "ON_HIDE_LOADER";


export const SIGNUP_USER = "SIGNUP_USER";
export const SIGNUP_USER_SUCCESS = "SIGNUP_USER_SUCCESS";
export const SIGNIN_GOOGLE_USER = "SIGNIN_GOOGLE_USER";
export const SIGNIN_GOOGLE_USER_SUCCESS = "SIGNIN_GOOGLE_USER_SUCCESS";
export const SIGNIN_FACEBOOK_USER = "SIGNIN_FACEBOOK_USER";
export const SIGNIN_FACEBOOK_USER_SUCCESS = "SIGNIN_FACEBOOK_USER_SUCCESS";
export const SIGNIN_TWITTER_USER = "SIGNIN_TWITTER_USER";
export const SIGNIN_TWITTER_USER_SUCCESS = "SIGNIN_TWITTER_USER_SUCCESS";
export const SIGNIN_GITHUB_USER = "SIGNIN_GITHUB_USER";
export const SIGNIN_GITHUB_USER_SUCCESS = "signin_github_user_success";
export const SIGNIN_USER = "SIGNIN_USER";
export const SIGNIN_USER_SUCCESS = "SIGNIN_USER_SUCCESS";
export const SIGNOUT_USER = "SIGNOUT_USER";
export const SIGNOUT_USER_SUCCESS = "SIGNOUT_USER_SUCCESS";
export const INIT_URL = "INIT_URL";
export const USER_DATA = "user_data";
export const USER_TOKEN_SET = "user_token_set";

export class Common {
  static AuthChallengeName = class AuthChallengeName {
    public static readonly NEW_PASSWORD_REQUIRED = "NEW_PASSWORD_REQUIRED";
    public static readonly MFA_SETUP = "MFA_SETUP";
    public static readonly SOFTWARE_TOKEN_MFA = "SOFTWARE_TOKEN_MFA";
    public static readonly TOTP = "TOTP";
    public static readonly SUCCESS = "success";
  };

  static Auth = class Auth {
    public static readonly NOT_AUTHORIZED_EXCEPTION =
      "Temporary password has expired and must be reset by an administrator.";
    public static readonly CODE_MISS_MATCH_EXCEPTION = "CodeMismatchException";
    public static readonly ENABLE_MFA_TOKEN_EXCEPTION =
      "EnableSoftwareTokenMFAException";
    public static readonly NOT_AUTHORIZED = "NotAuthorizedException";
    public static readonly NOMFA = "NOMFA";
    public static readonly TOTP = "TOTP";
    public static readonly SECURITY_CODE_INVALID =
      "EnableSoftwareTokenMFAException";
  };

  static AuthStage = class AuthStage {
    public static readonly SIGNIN = 0;
    public static readonly QR_SCAN = 1;
    public static readonly VERIFICATION_CODE = 2;
    public static readonly FORGOT_PASSWORD = 3;
    public static readonly CHANGE_PASSWORD = 4;
    public static readonly CHANGE_PASSWORD_WITH_VERIFICATION_CODE = 5;
  };
}
