import type { ReactNode } from 'react';

interface ActionWrapperProps {
  children: ReactNode;
}

const ActionWrapper = ({ children }: ActionWrapperProps) => (
  <div
    className="action-wrapper"
    style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}
  >
    {children}
  </div>
);

export default ActionWrapper;
