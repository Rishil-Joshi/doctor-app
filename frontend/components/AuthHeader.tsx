import Link from 'next/link';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  switchText?: string;
  switchLink?: string;
  switchLinkText?: string;
}

export function AuthBranding() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-teal-200 flex items-center justify-center shadow-sm">
        <span className="text-4xl font-black text-white">🩺</span>
      </div>
      <h1 className="text-4xl font-black uppercase tracking-[0.2em] text-slate-900">SURGIFLOW</h1>
      <p className="text-xs uppercase tracking-[0.35em] font-semibold text-slate-500">
        CLINICAL PATIENT MANAGEMENT
      </p>
    </div>
  );
}

export function AuthHeader({ title, subtitle, switchText, switchLink, switchLinkText }: AuthHeaderProps) {
  return (
    <div>
      <h2 className="text-3xl font-black uppercase tracking-tight text-slate-800 mb-2">{title}</h2>
      {subtitle && <p className="text-sm font-medium text-slate-500 mb-5">{subtitle}</p>}

      {switchText && switchLink && switchLinkText && (
        <p className="text-center text-xs uppercase tracking-[0.28em] text-slate-500">
          {switchText}{' '}
          <Link href={switchLink} className="text-teal-500 underline font-semibold ml-1">
            {switchLinkText}
          </Link>
        </p>
      )}
    </div>
  );
}
