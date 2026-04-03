import Link from 'next/link';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  switchText: string;
  switchLink: string;
  switchLinkText: string;
}

export function AuthHeader({ title, subtitle, switchText, switchLink, switchLinkText }: AuthHeaderProps) {
  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-xl bg-teal-200 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">🩺</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">SURGIFLOW</h1>
        <p className="text-sm font-medium text-slate-500">Clinical Patient Management</p>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
      {subtitle && <p className="text-sm text-slate-600 mb-6">{subtitle}</p>}

      {switchText && (
        <p className="text-center text-sm font-medium text-slate-600 mb-6">
          {switchText}
          <Link href={switchLink} className="text-teal-500 underline ml-1">
            {switchLinkText}
          </Link>
        </p>
      )}
    </div>
  );
}
