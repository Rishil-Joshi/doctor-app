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
      <label className="block text-[0.7rem] uppercase tracking-[0.25em] font-semibold text-slate-500 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition disabled:cursor-not-allowed focus:border-teal-400 focus:ring-2 focus:ring-teal-200 ${
          error ? 'border-red-500' : 'border-slate-200'
        }`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {helperText && <p className="text-gray-500 text-xs mt-1">{helperText}</p>}
    </div>
  );
}
