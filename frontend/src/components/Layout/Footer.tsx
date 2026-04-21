export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex-shrink-0 border-t border-gray-100 bg-white py-3 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center">
        <p className="text-xs text-gray-500">
          &copy; {year}{' '}
          <span className="font-semibold text-gray-700">P2P-ORG</span>. All rights reserved.
        </p>
        <span className="hidden sm:inline text-gray-300">·</span>
        <p className="text-xs text-gray-400">
          Powered by <span className="text-emerald-600 font-medium">Procure-to-Pay</span>
        </p>
      </div>
    </footer>
  );
}
