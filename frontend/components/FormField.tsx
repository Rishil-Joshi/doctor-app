import React from 'react';

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  helperText?: string;
}

export function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border p-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-200 ${
          error ? 'border-red-500' : 'border-slate-200'
        }`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {helperText && <p className="text-gray-500 text-xs mt-1">{helperText}</p>}
    </div>
  );
}
