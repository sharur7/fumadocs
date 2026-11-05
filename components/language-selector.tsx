'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  languageFromPathname,
  persistDocsLanguage,
  switchLanguagePath,
  type DocsLanguage,
} from '@/lib/language';

const languages: {
  code: DocsLanguage | 'go' | 'rust';
  name: string;
  icon: string;
  coming?: boolean;
}[] = [
  { code: 'typescript', name: 'TypeScript', icon: '/languages/typescript.svg' },
  { code: 'python', name: 'Python', icon: '/languages/python.svg' },
  { code: 'go', name: 'Go', icon: '/languages/go.svg', coming: true },
  { code: 'rust', name: 'Rust', icon: '/languages/rust.svg', coming: true },
];

export function LanguageSelector() {
  const pathname = usePathname() || '/';
  const current = languageFromPathname(pathname);

  useEffect(() => {
    persistDocsLanguage(current);
  }, [current]);

  return (
    <nav
      aria-label="SDK language"
      className="flex items-center gap-0.5 rounded-lg border border-border-panel bg-background-surface/50 p-0.5 shadow-sm"
    >
      {languages.map((lang) => {
        const selected = lang.code === current;
        const className = `
          items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md transition-colors
          ${lang.coming ? 'hidden xl:flex opacity-40 cursor-not-allowed text-text-muted' : 'flex'}
          ${selected && !lang.coming ? 'bg-signalBlue/15 font-semibold text-signalBlue' : ''}
          ${!selected && !lang.coming ? 'text-text-secondary hover:text-text-primary hover:bg-background-base' : ''}
        `;
        const label = (
          <>
            <img
              src={lang.icon}
              alt=""
              width={16}
              height={16}
              className={`shrink-0 object-contain ${lang.code === 'go' ? 'h-3.5 w-6' : 'h-4 w-4'}`}
              aria-hidden
            />
            <span className="hidden sm:inline">{lang.name}</span>
            {lang.coming && (
              <span className="hidden 2xl:inline text-[9px] leading-none text-text-muted bg-background-base px-1 py-0.5 rounded border border-border-soft">
                Soon
              </span>
            )}
          </>
        );

        if (lang.coming) {
          return (
            <span key={lang.code} className={className} title={`${lang.name} docs coming soon`}>
              {label}
            </span>
          );
        }

        const href = switchLanguagePath(pathname, lang.code as DocsLanguage);
        return (
          <a
            key={lang.code}
            href={href}
            aria-current={selected ? 'page' : undefined}
            onClick={(event) => {
              persistDocsLanguage(lang.code as DocsLanguage);
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              if (href === pathname) {
                event.preventDefault();
                return;
              }
              event.preventDefault();
              window.location.assign(href);
            }}
            className={className}
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
}
