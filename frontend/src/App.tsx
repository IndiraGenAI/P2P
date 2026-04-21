import { useState } from 'react';
import { LoginPage } from '@/components/auth/LoginPage';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTitle } from '@/components/layout/PageTitle';
import { EcommerceDashboard } from '@/pages/EcommerceDashboard';
import { ProfilePage } from '@/pages/ProfilePage';
import { DataTablePage } from '@/pages/DataTablePage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import type { PageKey } from '@/types';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  'user-management': 'User Management',
  workflows: 'Workflows',
  'workflows-v2': 'Workflow (V2)',
  'item-approval': 'Item Approval',
  'vendor-approval': 'Vendor Approval',
  'budget-approval': 'Budget Approval',
  'masters-control': 'Masters Control',
  'role-config': 'Role Config',
  'purchase-request': 'Purchase Request',
  'rate-contract': 'Rate Contract',
  'purchase-order': 'Purchase Order',
  'direct-invoice': 'Direct Invoice',
  budgets: 'Budgets',
  profile: 'Profile',
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  const handleSignOut = () => setLoggedIn(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <EcommerceDashboard />;
      case 'user-management':
        return <DataTablePage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <PlaceholderPage title={pageTitles[currentPage] ?? 'Page'} />;
    }
  };

  const showPageTitle = currentPage !== 'profile' && currentPage !== 'dashboard';

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onSignOut={handleSignOut}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onSignOut={handleSignOut}
          setCurrentPage={setCurrentPage}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        {showPageTitle && <PageTitle title={pageTitles[currentPage] ?? 'Page'} />}
        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
        <Footer />
      </div>
    </div>
  );
}
