import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="p-6">
      <div className="soft-card p-12 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
          <Compass size={28} className="text-gray-500" />
        </div>
        <p className="text-5xl font-bold text-gray-900 mb-2">404</p>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h2>
        <p className="text-gray-500 max-w-md mb-6">
          The page you are looking for doesn't exist or has been moved.
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

export default NotFoundPage;
