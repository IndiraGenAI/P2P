import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Layout, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import React, { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { updateWindowWidth } from "./state/setting/setting.action";
import { Amplify, Auth } from "aws-amplify";
import { config } from "./utils";
import loginService from "./services/login/login.service";
import { userProfile } from "./state/users/user.action";
import { AppDispatch } from "./state/app.model";
import { SidebarCollapseContext } from "./contexts/SidebarCollapseContext";
import { ability, convertAbility } from "./ability";
import { Common } from "./utils/constants/constant";
import { IUserRole } from "./services/user/user.model";
import { IRolePermissionLink } from "./services/role/role.model";
import {
  loginSelector,
  setIsBranchSelected,
} from "./state/Login/login.reducer";
import { rules } from "./utils/models/common";
import { userSelector } from "./state/users/user.reducer";
import { SidebarPermissionCodeContext } from "./contexts/sidebarPermissionCodeContext";
import { Helmet } from "react-helmet";
import { LoginPageMeta } from "./utils/constants/MetaInfoConstant";
import Loading from "./components/Loading";
import P2PBrandHeader from "./components/BrandLogo/P2PBrandHeader";

const { Content, Sider } = Layout;

const Login = lazy(() => import("./pages/Login"));
const UserBranchSelection = lazy(
  () => import("./pages/Login/UserBranchSelection"),
);
const NotAccess = lazy(() => import("./pages/NotAccess"));
const NotFound = lazy(() => import("./pages/404NotFound/NotFound"));
const MainDashboard = lazy(() => import("./pages/MainDashboard"));
const MainStatisticsDashboard = lazy(
  () => import("./pages/MainStatisticsDashboard"),
);
const Department = lazy(() => import("./pages/Department"));
const User = lazy(() => import("./pages/User"));
const UserProfileContent = lazy(
  () => import("./pages/UserProfileContent"),
);
const CheckVersionModal = lazy(() => import("./components/CheckVersion"));

const amplifyAuth: Record<string, unknown> = {
  mandtorySignId: true,
  region: config.aws.region,
  userPoolId: config.aws.userPoolId,
  userPoolWebClientId: config.aws.userPoolWebClientId,
};
// cookieStorage.domain must be set or Amplify throws at configure() and the app never mounts.
if (config.aws.cookieDomain) {
  amplifyAuth.cookieStorage = {
    domain: config.aws.cookieDomain,
    path: "/",
    expires: 7,
    secure: false,
  };
}

Amplify.configure({
  Auth: amplifyAuth,
  ssr: true,
});

function RequireBranch() {
  const { isBranchSelected } = useSelector(loginSelector);
  if (!isBranchSelected) {
    return <Navigate to="/select-branch" replace />;
  }
  return <Outlet />;
}

function AuthenticatedShellLayout() {
  const location = useLocation();
  const path = location.pathname;

  const selected = (() => {
    if (path.startsWith("/sectors")) {
      return ["/sectors"];
    }
    if (path.startsWith("/users")) {
      return ["/users"];
    }
    if (path.startsWith("/statistics-dashboard")) {
      return ["/statistics-dashboard"];
    }
    if (path.startsWith("/userprofile")) {
      return ["/userprofile"];
    }
    return ["/"];
  })();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth={0} theme="dark" width={220}>
        <div style={{ padding: "12px 8px 16px" }}>
          <P2PBrandHeader logoWidth={120} subtitleLight />
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={selected}>
          <Menu.Item key="/">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/sectors">
            <Link to="/sectors">Sectors</Link>
          </Menu.Item>
          <Menu.Item key="/users">
            <Link to="/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="/statistics-dashboard">
            <Link to="/statistics-dashboard">Statistics</Link>
          </Menu.Item>
          <Menu.Item key="/userprofile">
            <Link to="/userprofile">Profile</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { isBranchSelected, userRoleId } = useSelector(loginSelector);
  const { userData } = useSelector(userSelector);
  const [isCode, setIsCode] = useState<string[]>([]);

  useEffect(() => {
    const code: string[] = [];
    userData?.data?.user_roles?.forEach((x: IUserRole) => {
      if (x.id === userRoleId) {
        x.role?.role_permissions?.forEach((y: IRolePermissionLink) => {
          const pageCode = y?.page_action?.page?.page_code;
          if (pageCode && !code.includes(pageCode)) {
            code.push(pageCode);
          }
        });
      }
    });
    setIsCode(code);
  }, [userData, userRoleId]);

  useEffect(() => {
    dispatch(updateWindowWidth(window.innerWidth));
    const onResize = () => dispatch(updateWindowWidth(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [dispatch]);

  useEffect(() => {
    if (isLogin) {
      Auth.currentSession()
        .then(() => {
          dispatch(userProfile({})).then((res: any) => {
            if (res.payload?.data.user_roles.length === 0) {
              dispatch(setIsBranchSelected(false));
              ability.update([]);
              navigate("/access-denied");
            } else if (userRoleId) {
              const data = res.payload?.data.user_roles.find(
                (value: IUserRole) => value.id === userRoleId,
              );
              if (!data) {
                if (res.payload?.data.user_roles.length > 0) {
                  dispatch(setIsBranchSelected(false));
                  navigate("/select-branch");
                }
              } else {
                const nextRules = convertAbility(
                  data.role.role_permissions,
                ) as rules;
                ability.update(nextRules);
              }
            }
          });
        })
        .catch(() => {});
    }
  }, [isLogin, dispatch, navigate, userRoleId]);

  const checkAuth = useCallback(
    (url = "") => {
      const isLoginPage = url.startsWith("/login");
      const isP2P = url.startsWith("/p2p");
      loginService
        .getCognitoUser({
          bypassCache: true,
        })
        .then(() => {
          setIsLogin(true);
          if (isLoginPage || isP2P) {
            navigate("/");
          }
        })
        .catch(() => {
          setIsLogin(false);
          if (!isLoginPage && !isP2P) {
            navigate("/login");
          }
        });
    },
    [navigate],
  );

  useEffect(() => {
    checkAuth(location.pathname);
  }, [location.pathname, checkAuth]);

  return (
    <SidebarCollapseContext.Provider
      value={{ sidebarCollapsed, setSidebarCollapsed }}
    >
      {isLogin === false ? (
        <>
          <Helmet>
            <title>{LoginPageMeta.PAGE_TITLE}</title>
          </Helmet>
          <Routes>
            <Route
              path="/login"
              element={
                <Suspense fallback={<Loading />}>
                  <Login />
                </Suspense>
              }
            />
            <Route path="/p2p/*" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </>
      ) : (
        <SidebarPermissionCodeContext.Provider value={{ isCode, setIsCode }}>
          <Layout>
            <Helmet>
              <title>{LoginPageMeta.MAIN_TITLE}</title>
            </Helmet>
            <Suspense fallback={<Loading />}>
              <CheckVersionModal />
            </Suspense>
            <Routes>
              <Route
                path="/select-branch"
                element={
                  <Suspense fallback={<Loading />}>
                    {isBranchSelected ? (
                      <Navigate to="/" replace />
                    ) : (
                      <UserBranchSelection />
                    )}
                  </Suspense>
                }
              />
              <Route
                path="/access-denied"
                element={
                  <Suspense fallback={<Loading />}>
                    <NotAccess />
                  </Suspense>
                }
              />
              <Route element={<RequireBranch />}>
                <Route element={<AuthenticatedShellLayout />}>
                  <Route
                    path="/"
                    element={
                      <Suspense fallback={<Loading />}>
                        <MainDashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <Suspense fallback={<Loading />}>
                        <MainDashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/statistics-dashboard"
                    element={
                      <Suspense fallback={<Loading />}>
                        <MainStatisticsDashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    element={
                      ability.can(
                        Common.Actions.CAN_VIEW,
                        Common.Modules.MASTER.DEPARTMENTS,
                      ) ? (
                        <Outlet />
                      ) : (
                        <Suspense fallback={<Loading />}>
                          <NotFound />
                        </Suspense>
                      )
                    }
                  >
                    <Route
                      path="/sectors"
                      element={
                        <Suspense fallback={<Loading />}>
                          <Department />
                        </Suspense>
                      }
                    />
                  </Route>
                  <Route
                    element={
                      ability.can(
                        Common.Actions.CAN_VIEW,
                        Common.Modules.USER_CONFIGURATION.USERS,
                      ) ? (
                        <Outlet />
                      ) : (
                        <Suspense fallback={<Loading />}>
                          <NotFound />
                        </Suspense>
                      )
                    }
                  >
                    <Route
                      path="/users"
                      element={
                        <Suspense fallback={<Loading />}>
                          <User />
                        </Suspense>
                      }
                    />
                  </Route>
                  <Route
                    path="/userprofile"
                    element={
                      <Suspense fallback={<Loading />}>
                        <UserProfileContent />
                      </Suspense>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <Suspense fallback={<Loading />}>
                        <NotFound />
                      </Suspense>
                    }
                  />
                </Route>
              </Route>
              <Route
                path="*"
                element={<Navigate to="/select-branch" replace />}
              />
            </Routes>
          </Layout>
        </SidebarPermissionCodeContext.Provider>
      )}
    </SidebarCollapseContext.Provider>
  );
}

export default App;
