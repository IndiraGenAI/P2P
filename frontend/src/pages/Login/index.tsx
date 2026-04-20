import { message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ability, convertAbility } from "src/ability";
import LoginForm from "src/components/LoginForm";
import ForgotPasswordForm from "src/components/LoginForm/ForgotPasswordForm";
import { IResetPasswordForm } from "src/components/LoginForm/LoginForm.model";
import ResetPasswordForm from "src/components/LoginForm/ResetPasswordForm";
import {
  IForgotPasswordChangeField,
  IForgotPasswordFormField,
  IResetPasswordDTO,
} from "src/services/login/login.model";
import { AppDispatch } from "src/state/app.model";
import {
  forcePasswordChange,
  forgotPassword,
  forgotPasswordChange,
  loginUserData,
} from "src/state/Login/login.action";
import {
  clearRemoveMessage,
  loginSelector,
  setIsBranchSelected,
  setUserRoleId,
} from "src/state/Login/login.reducer";
import { changePassword, userProfile } from "src/state/users/user.action";
import { Common } from "src/utils/constants/ActionTypes";
import { rules } from "src/utils/models/common";

const Login = () => {
  const [stage, setStage] = useState(Common.AuthStage.SIGNIN);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState<string | undefined>();
  const [loading, setLoading] = useState<any>(null);
  const loginState = useSelector(loginSelector);
  let navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onLogin = (email: string, password: string) => {
    setLoading(true);
    dispatch(loginUserData({ email, password }))
      .then((res) => {
        commonChallengeName(res);
        setLoading(false);
      })
      .catch((error) => {
        let errMsg = "";
        if (error.code === Common.Auth.NOT_AUTHORIZED_EXCEPTION) {
          errMsg =
            "Your password has expired and must be reset by an administrator.";
        } else {
          errMsg = "Incorrect username or password.";
        }
        message.error(errMsg);
        setLoading(false);
      });
  };

  const commonChallengeName = async (data: any) => {
    switch (data.payload?.status) {
      case Common.AuthChallengeName.SUCCESS:
        // store user and redirect to home
        setUser(data.payload.user);
        dispatch(userProfile())
          .then((res) => {
            localStorage.setItem(
              "myStorageID",
              res.payload.data.user_roles[0].id
            );
            if (res.payload.data.user_roles.length === 0) {
              navigate("/access-denied");
            } else {
              if (res.payload.data.user_roles.length > 1) {
                navigate("/select-branch");
              } else {
                dispatch(setUserRoleId(res.payload.data.user_roles[0].id));
                dispatch(setIsBranchSelected(true));
                const rules = convertAbility(
                  res.payload.data.user_roles[0].role.role_permissions
                ) as rules;
                ability.update(rules);
                navigate("/");
              }
            }
          })
          .catch(() => {
            message.error(
              "There was some technical error processing this request. Please try again."
            );
          });
        break;

      case Common.AuthChallengeName.SOFTWARE_TOKEN_MFA:
        setUser(data.user);
        setStage(Common.AuthStage.VERIFICATION_CODE);
        break;
      case Common.AuthChallengeName.NEW_PASSWORD_REQUIRED:
        setUser(data.payload.user);
        setEmail(data.payload.email);
        setStage(Common.AuthStage.CHANGE_PASSWORD);
        break;
      default:
        break;
    }
  };

  const onChangePassword = (value: IResetPasswordForm) => {
    setLoading(true);
    if (stage === Common.AuthStage.CHANGE_PASSWORD) {
      // const userEmail = user?.challengeParam?.userAttributes?.email;
      const resetPasswordInput: IResetPasswordDTO = {
        user: user,
        newPassword: value.password,
      };
      dispatch(forcePasswordChange(resetPasswordInput))
        .then((res) => {
          message.success("Your password is reset successfully.");
          if (email) {
            dispatch(changePassword({ email: email })).then((res) => {
              commonChallengeName(res);
              setStage(Common.AuthStage.SIGNIN);
            });
          }
        })
        .catch(() => {
          setLoading(false);
          message.error("Error while processing your request.");
        });
    } else {
      if (value) {
        const forgotPassword: IForgotPasswordChangeField = {
          email: email ?? "",
          code: value.code ?? "",
          password: value.password,
        };
        dispatch(forgotPasswordChange(forgotPassword))
          .then(() => {
            message.success("Your password is reset successfully.");
            setStage(Common.AuthStage.SIGNIN);
            setLoading(false);
          })
          .catch((error) => {
            let errMsg = "";
            if (error.code === Common.Auth.CODE_MISS_MATCH_EXCEPTION) {
              errMsg = "Verification code invalid.";
            } else {
              errMsg = "Error while processing your request.";
            }
            message.error(errMsg);
            setLoading(false);
          });
      }
    }
  };

  const onForgotPassword = (value: IForgotPasswordFormField) => {
    setEmail(value.email);
    setLoading(true);
    dispatch(forgotPassword(value))
      .then(async () => {
        handleChangeStage(
          Common.AuthStage.CHANGE_PASSWORD_WITH_VERIFICATION_CODE,
          value.email
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        message.error("Email address is invalid.");
      });
  };

  const handleChangeStage = (stageValue: number, email?: string) => {
    setEmail(email);
    setStage(stageValue);
  };

  useEffect(() => {
    if (loginState.userData.message) {
      if (loginState.userData.hasErrors) {
        message.error(loginState.userData.message);
      } else {
        message.success(loginState.userData.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [loginState.userData.message]);

  return (
    <>
      {stage === Common.AuthStage.SIGNIN && (
        <LoginForm
          onLogin={onLogin}
          onChangeStage={handleChangeStage}
          loading={loading}
        />
      )}
      {stage === Common.AuthStage.FORGOT_PASSWORD && (
        <ForgotPasswordForm
          onChangeStage={handleChangeStage}
          onForgotPassword={onForgotPassword}
          isLoading={loading}
        />
      )}
      {(stage === Common.AuthStage.CHANGE_PASSWORD ||
        stage === Common.AuthStage.CHANGE_PASSWORD_WITH_VERIFICATION_CODE) && (
        <ResetPasswordForm
          stage={stage}
          onChangePassword={onChangePassword}
          isLoading={loading}
        />
      )}
    </>
  );
};

export default Login;
