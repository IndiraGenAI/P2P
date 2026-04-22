import { ChevronRight } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { APP_MENU_ITEMS } from '@/data';
import type { MenuItem } from '@/common/models';

interface Crumb {
  label: string;
  to?: string;
}

const HIDDEN_PATHS = new Set(['/dashboard', '/profile', '/login']);

// Routes whose pages render their own header/breadcrumb and want the full
// height. Matches both the bare prefix and any `/prefix/...` sub-path.
const HIDDEN_PREFIXES = ['/permissions'];

function findTrail(items: MenuItem[], pathname: string, trail: MenuItem[] = []): MenuItem[] | null {
  for (const item of items) {
    const next = [...trail, item];
    if (item.to && (item.to === pathname || pathname.startsWith(item.to + '/'))) {
      return next;
    }
    if (item.children?.length) {
      const found = findTrail(item.children, pathname, next);
      if (found) return found;
    }
  }
  return null;
}

export function PageTitle() {
  const { pathname } = useLocation();
  if (HIDDEN_PATHS.has(pathname)) return null;
  if (
    HIDDEN_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + '/'),
    )
  ) {
    return null;
  }

  const trail = findTrail(APP_MENU_ITEMS, pathname);
  const title = trail?.[trail.length - 1]?.label ?? 'Page';

  const crumbs: Crumb[] = [{ label: 'Home', to: '/dashboard' }];
  if (trail) {
    trail.forEach((item) => {
      crumbs.push({ label: item.label, to: item.to });
    });
  } else {
    crumbs.push({ label: title });
  }

  return (
    <div className="px-6 pt-6 flex items-center justify-between flex-wrap gap-3">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <div className="flex items-center gap-2 text-sm">
        {crumbs.map((c, i) => (
          <span key={`${c.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && <ChevronRight size={14} className="text-gray-400" />}
            {c.to && i < crumbs.length - 1 ? (
              <Link to={c.to} className="text-gray-500 hover:text-emerald-600">
                {c.label}
              </Link>
            ) : (
              <span
                className={i === crumbs.length - 1 ? 'text-gray-900' : 'text-gray-500'}
              >
                {c.label}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
