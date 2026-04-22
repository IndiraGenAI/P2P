import type { ReactNode } from 'react';

interface FloatLabelProps {
  label: string;
  placeholder?: string;
  name: string;
  required?: boolean;
  children: ReactNode;
}



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
