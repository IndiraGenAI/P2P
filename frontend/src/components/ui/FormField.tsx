interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  colSpan?: 1 | 2;
}

export function FormField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  colSpan = 1,
}: FormFieldProps) {
  return (
    <div className={colSpan === 2 ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-900 placeholder-gray-400 soft-input"
      />
    </div>
  );
}
