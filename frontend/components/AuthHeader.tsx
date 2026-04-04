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
      <div className="inline-flex items-center justify-center h-16 w-16 bg-pastel-mint-dark rounded-2xl mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9 text-white" aria-hidden="true">
          <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
        </svg>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">SURGIFLOW</h1>
      <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">CLINICAL PATIENT MANAGEMENT</p>
    </div>
  );
}

export function AuthHeader({ title, subtitle, switchText, switchLink, switchLinkText }: AuthHeaderProps) {
  return (
    <div>
      <h2 className="text-base font-bold mb-6 text-gray-800 uppercase tracking-widest">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest">{subtitle}</p>}

      {switchText && switchLink && switchLinkText && (
        <p className="text-center text-xs uppercase tracking-widest text-gray-500">
          {switchText}{' '}
          <Link href={switchLink} className="text-pastel-mint-dark font-bold hover:opacity-80 ml-1">
            {switchLinkText}
          </Link>
        </p>
      )}
    </div>
  );
}
