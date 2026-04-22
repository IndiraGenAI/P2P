import { APP_TAGLINE, COMPANY_NAME } from '@/common/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex-shrink-0 border-t border-gray-100 bg-white py-3 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center">
        <p className="text-xs text-gray-500">
          &copy; {currentYear}{' '}
          <span className="font-semibold text-gray-700">{COMPANY_NAME}</span>. All rights
          reserved.
        </p>
        <span className="hidden sm:inline text-gray-300">·</span>
        <p className="text-xs text-gray-400">
          Powered by <span className="text-emerald-600 font-medium">{APP_TAGLINE}</span>
        </p>
      </div>
    </footer>
  );
}
