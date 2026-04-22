import type { ReactNode } from 'react';

interface CommonFilterProps {
  children: ReactNode;
  fielterData?: (value: Record<string, unknown>) => void;
  change?: () => void;
  reset?: () => void;
}

/**
 * Layout wrapper used inside the antd `Drawer` filter form on the Role page.
 * The drawer's footer buttons drive submit/reset on the parent `<Form>`,
 * so this component only renders its children inside a consistent container.
 *
 * `fielterData`, `change`, and `reset` are accepted for backwards compatibility
 * with the legacy callsite signature; they're invoked by the parent form, not
 * by this component directly.
 */
const CommonFilter = ({ children }: CommonFilterProps) => (
  <div className="common-filter">{children}</div>
);

export default CommonFilter;
