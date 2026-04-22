import type { ReactNode } from 'react';

interface FloatLabelProps {
  label: string;
  placeholder?: string;
  name: string;
  required?: boolean;
  children: ReactNode;
}

/**
 * Minimal float-label wrapper. Renders a label above the field along with
 * an optional required indicator. Kept simple so the legacy Role page
 * (which already provides its own antd Form.Item rules) renders consistently.
 */
const FloatLabel = ({ label, name, required, children }: FloatLabelProps) => (
  <div className="float-label" data-field={name} style={{ marginBottom: 16 }}>
    <label
      htmlFor={name}
      style={{ display: 'block', fontSize: 12, color: '#6B7280', marginBottom: 4 }}
    >
      {label}
      {required && <span style={{ color: '#dc2626', marginLeft: 4 }}>*</span>}
    </label>
    {children}
  </div>
);

export default FloatLabel;
