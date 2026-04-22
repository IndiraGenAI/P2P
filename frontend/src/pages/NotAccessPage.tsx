import { ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotAccessPage() {
  return (
    <div className="p-6">
      <div className="soft-card p-12 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-5">
          <ShieldOff size={28} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access denied</h2>
        <p className="text-gray-500 max-w-md mb-6">
          You don't have permission to view this page. Contact your administrator if
          you think this is a mistake.
        </p>
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotAccessPage;
