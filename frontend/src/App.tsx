import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { LoginPage } from '@/components/auth/LoginPage';
import { RegisterPage } from '@/components/auth/RegisterPage';
import { RequirePage } from '@/components/auth/RequirePage';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTitle } from '@/components/layout/PageTitle';
import { EcommerceDashboard } from '@/pages/EcommerceDashboard';
import { ProfilePage } from '@/pages/ProfilePage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { RolesPage } from '@/pages/RolesPage';
import { PermissionsPage } from '@/pages/PermissionsPage';
import { UsersPage } from '@/pages/Users';
import { NotAccessPage } from '@/pages/NotAccessPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ability, applyAbility, pageCodesFrom } from '@/ability';
import { AbilityContext } from '@/ability/can';
import {
  SidebarPermissionCodeProvider,
  useSidebarPermissionCodes,
} from '@/contexts/SidebarPermissionCodeContext';
import { Common } from '@/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import { fetchProfile } from '@/state/auth/auth.action';
import { authSelector, signOut as signOutAction } from '@/state/auth/auth.reducer';

interface ProtectedLayoutProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onSignOut: () => void;
}

function ProtectedLayout({
  isSidebarOpen,
  setIsSidebarOpen,
  onSignOut,
}: Readonly<ProtectedLayoutProps>) {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onSignOut={onSignOut}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <Header
          onSignOut={onSignOut}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <PageTitle />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

interface AppRoutesProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onSignOut: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

function AppRoutes({
  isLoggedIn,
  onLogin,
  onSignOut,
  isSidebarOpen,
  setIsSidebarOpen,
}: Readonly<AppRoutesProps>) {
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
        <Route path="/register" element={<RegisterPage onRegister={onLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const { Modules } = Common;

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="/register" element={<Navigate to="/dashboard" replace />} />
      <Route
        element={
          <ProtectedLayout
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            onSignOut={onSignOut}
          />
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Always-on routes (no permission required). */}
        <Route path="/dashboard" element={<EcommerceDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/access-denied" element={<NotAccessPage />} />

        {/* Permission-gated routes. */}
        <Route element={<RequirePage pageCode={Modules.USER_CONFIGURATION.USERS} />}>
          <Route path="/user-management" element={<UsersPage />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.USER_CONFIGURATION.ROLES} />}>
          <Route path="/roles" element={<RolesPage />} />
        </Route>
        <Route
          element={
            <RequirePage
              pageCode={Modules.USER_CONFIGURATION.ROLES}
              action={Common.Actions.CAN_ASSIGN_PERMISSION}
            />
          }
        >
          <Route path="/permissions/:id" element={<PermissionsPage />} />
        </Route>

        <Route element={<RequirePage pageCode={Modules.WORKFLOW.WORKFLOW_V1} />}>
          <Route path="/workflows" element={<PlaceholderPage title="Workflows" />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.WORKFLOW.WORKFLOW_V2} />}>
          <Route path="/workflows-v2" element={<PlaceholderPage title="Workflow (V2)" />} />
        </Route>

        <Route element={<RequirePage pageCode={Modules.APPROVALS.ITEM_APPROVAL} />}>
          <Route path="/item-approval" element={<PlaceholderPage title="Item Approval" />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.APPROVALS.VENDOR_APPROVAL} />}>
          <Route
            path="/vendor-approval"
            element={<PlaceholderPage title="Vendor Approval" />}
          />
        </Route>
        <Route element={<RequirePage pageCode={Modules.APPROVALS.BUDGET_APPROVAL} />}>
          <Route
            path="/budget-approval"
            element={<PlaceholderPage title="Budget Approval" />}
          />
        </Route>

        <Route element={<RequirePage pageCode={Modules.MASTER.MASTER} />}>
          <Route
            path="/masters-control"
            element={<PlaceholderPage title="Masters Control" />}
          />
        </Route>

        <Route element={<RequirePage pageCode={Modules.PROCUREMENT.PURCHASE_REQUEST} />}>
          <Route
            path="/purchase-request"
            element={<PlaceholderPage title="Purchase Request" />}
          />
        </Route>
        <Route element={<RequirePage pageCode={Modules.PROCUREMENT.RATE_CONTRACT} />}>
          <Route
            path="/rate-contract"
            element={<PlaceholderPage title="Rate Contract" />}
          />
        </Route>
        <Route element={<RequirePage pageCode={Modules.PROCUREMENT.PURCHASE_ORDER} />}>
          <Route
            path="/purchase-order"
            element={<PlaceholderPage title="Purchase Order" />}
          />
        </Route>
        <Route element={<RequirePage pageCode={Modules.PROCUREMENT.DIRECT_INVOICE} />}>
          <Route
            path="/direct-invoice"
            element={<PlaceholderPage title="Direct Invoice" />}
          />
        </Route>

        <Route element={<RequirePage pageCode={Modules.FINANCE.BUDGETS} />}>
          <Route path="/budgets" element={<PlaceholderPage title="Budgets" />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

function AppShell() {
  const dispatch = useAppDispatch();
  const { accessToken, profile } = useAppSelector(authSelector);
  const isLoggedIn = !!accessToken;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { setIsCode } = useSidebarPermissionCodes();

  // If we already have a token in localStorage on app start, validate it via
  // /auth/me. If the call fails the auth slice clears the token automatically
  // (see authSlice.fetchProfile.rejected) which flips us back to /login.
  useEffect(() => {
    if (accessToken && !profile.data && !profile.loading) {
      dispatch(fetchProfile());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // Bootstrap permissions whenever the user becomes logged in OR whenever
  // /auth/me returns a fresh profile (which carries the user's role_permissions
  // joined to page+action). Drives both CASL ability and the sidebar `isCode`
  // allow-list so the menu always reflects what the backend actually grants.
  useEffect(() => {
    if (!isLoggedIn) {
      ability.update([]);
      setIsCode([]);
      return;
    }
    const rolePermissions = profile.data?.role_permissions ?? [];
    applyAbility(rolePermissions);
    setIsCode(pageCodesFrom(rolePermissions));
  }, [isLoggedIn, profile.data, setIsCode]);

  const handleLogin = () => {
    navigate('/dashboard', { replace: true });
  };

  const handleSignOut = () => {
    dispatch(signOutAction());
    ability.update([]);
    setIsCode([]);
    navigate('/login', { replace: true });
  };

  return (
    <AppRoutes
      isLoggedIn={isLoggedIn}
      onLogin={handleLogin}
      onSignOut={handleSignOut}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    />
  );
}

export default function App() {
  return (
    <AbilityContext.Provider value={ability}>
      <SidebarPermissionCodeProvider>
        <AppShell />
      </SidebarPermissionCodeProvider>
    </AbilityContext.Provider>
  );
}
