import { useEffect, useRef, useState } from 'react';
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
import { CountryPage } from '@/pages/Country';
import { StatePage } from '@/pages/State';
import { CityPage } from '@/pages/City';
import { ZonePage } from '@/pages/Zone';
import { DepartmentPage } from '@/pages/Department';
import { SubdepartmentPage } from '@/pages/Subdepartment';
import { CostCenterPage } from '@/pages/CostCenter';
import { CenterPage } from '@/pages/Center';
import InvoiceSourcePage from '@/pages/InvoiceSource';
import CurrencyPage from '@/pages/Currency';
import VoucherPage from '@/pages/Voucher';
import GstPage from '@/pages/Gst';
import TdsPage from '@/pages/Tds';
import CoaCategoryPage from '@/pages/CoaCategory';
import CoaPage from '@/pages/Coa';
import { NotAccessPage } from '@/pages/NotAccessPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ability } from '@/ability';
import { AbilityContext } from '@/ability/can';
import { SidebarPermissionCodeProvider } from '@/contexts/SidebarPermissionCodeContext';
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

        {}
        <Route path="/dashboard" element={<EcommerceDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/access-denied" element={<NotAccessPage />} />

        {}
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

        {/* Masters - Purchasing */}
        <Route element={<RequirePage pageCode={Modules.MASTER.VENDOR} />}>
          <Route path="/masters/vendor" element={<PlaceholderPage title="Vendor" />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.VENDOR_SITE} />}>
          <Route
            path="/masters/vendor-site"
            element={<PlaceholderPage title="Vendor Site" />}
          />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.VENDOR_CATEGORY} />}>
          <Route
            path="/masters/vendor-category"
            element={<PlaceholderPage title="Vendor Category" />}
          />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.APPLICANT_TYPE} />}>
          <Route
            path="/masters/applicant-type"
            element={<PlaceholderPage title="Applicant Type" />}
          />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.ITEM} />}>
          <Route path="/masters/item" element={<PlaceholderPage title="Item" />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.ITEM_TYPE} />}>
          <Route
            path="/masters/item-type"
            element={<PlaceholderPage title="Item Type" />}
          />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.ITEM_CATEGORY} />}>
          <Route
            path="/masters/item-category"
            element={<PlaceholderPage title="Item Category" />}
          />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.UOM} />}>
          <Route path="/masters/uom" element={<PlaceholderPage title="UOM" />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.PAYMENT_TERMS} />}>
          <Route
            path="/masters/payment-terms"
            element={<PlaceholderPage title="Payment Terms" />}
          />
        </Route>

        {/* Masters - Organization */}
        <Route element={<RequirePage pageCode={Modules.MASTER.DEPARTMENT} />}>
          <Route path="/masters/department" element={<DepartmentPage />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.SUBDEPARTMENT} />}>
          <Route path="/masters/subdepartment" element={<SubdepartmentPage />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.COST_CENTER} />}>
          <Route path="/masters/cost-center" element={<CostCenterPage />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.ENTITY} />}>
          <Route path="/masters/entity" element={<PlaceholderPage title="Entity" />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.CENTER} />}>
          <Route path="/masters/center" element={<CenterPage />} />
        </Route>

        {/* Masters - Finance & Tax */}
        <Route element={<RequirePage pageCode={Modules.MASTER.COA_CATEGORY} />}>
          <Route path="/masters/coa-category" element={<CoaCategoryPage />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.COA} />}>
          <Route path="/masters/coa" element={<CoaPage />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.TDS} />}>
          <Route path="/masters/tds" element={<TdsPage />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.GST} />}>
          <Route path="/masters/gst" element={<GstPage />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.VOUCHER} />}>
          <Route path="/masters/voucher" element={<VoucherPage />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.INVOICE_SOURCE} />}>
          <Route path="/masters/invoice-source" element={<InvoiceSourcePage />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.CURRENCY} />}>
          <Route path="/masters/currency" element={<CurrencyPage />} />
        </Route>

        {/* Masters - Geography */}
        <Route element={<RequirePage pageCode={Modules.MASTER.COUNTRY} />}>
          <Route path="/masters/country" element={<CountryPage />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.ZONE} />}>
          <Route path="/masters/zone" element={<ZonePage />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.STATE} />}>
          <Route path="/masters/state" element={<StatePage />} />
        </Route>
        <Route element={<RequirePage pageCode={Modules.MASTER.CITY} />}>
          <Route path="/masters/city" element={<CityPage />} />
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
  const { accessToken } = useAppSelector(authSelector);
  const isLoggedIn = !!accessToken;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Track which accessToken we've already fetched the profile for. Using a
  // ref (instead of `profile.loading` / `profile.data`) is the only
  // StrictMode-safe way to dedupe — under <StrictMode> the effect runs twice
  // with the SAME render closure, so both invocations see the pre-dispatch
  // Redux state and would both fire unless we guard with mutable state
  // outside React state.
  //
  // We deliberately do NOT short-circuit on `profile.data` being truthy:
  // after login the reducer pre-fills `profile.data` from the login response,
  // but that payload doesn't include `role_permissions`. The `/me` call is
  // what populates CASL + the sidebar, so it must run on every fresh token.
  const fetchedProfileForToken = useRef<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      fetchedProfileForToken.current = null;
      return;
    }
    if (fetchedProfileForToken.current === accessToken) return;
    fetchedProfileForToken.current = accessToken;
    dispatch(fetchProfile());
  }, [accessToken]);





  const handleLogin = () => {
    navigate('/dashboard', { replace: true });
  };

  const handleSignOut = () => {
    dispatch(signOutAction());
    ability.update([]);
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
