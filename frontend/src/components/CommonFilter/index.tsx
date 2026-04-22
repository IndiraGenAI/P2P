import type { ReactNode } from 'react';

interface CommonFilterProps {
  children: ReactNode;
  fielterData?: (value: Record<string, unknown>) => void;
  change?: () => void;
  reset?: () => void;
}



const CommonFilter = ({ children }: CommonFilterProps) => (
  <div className="common-filter">{children}</div>
);

export default CommonFilter;
