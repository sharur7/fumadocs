'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { GITHUB_URLS, type DocsLanguage } from '@/lib/language';

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const REPOS: {
  key: DocsLanguage;
  name: string;
  repo: string;
  url: string;
  icon: string;
  description: string;
}[] = [
  {
    key: 'typescript',
    name: 'TypeScript',
    repo: 'nitrostack',
    url: GITHUB_URLS.typescript,
    icon: '/languages/typescript.svg',
    description: 'TypeScript MCP framework, CLI & SDK',
  },
  {
    key: 'python',
    name: 'Python',
    repo: 'nitrostack-python-sdk',
    url: GITHUB_URLS.python,
    icon: '/languages/python.svg',
    description: 'Python MCP SDK & Pydantic tools',
  },
];

export function GithubDropdown({
  variant = 'hero',
  language,
}: {
  variant?: 'hero' | 'nav';
  language?: DocsLanguage;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (variant === 'nav') {
    return (
      <div className="relative font-sans" ref={rootRef}>
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="GitHub repositories"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-[9px] border border-fd-border bg-fd-background text-fd-foreground hover:bg-fd-accent hover:border-[var(--nx-brand-ring)] transition-colors cursor-pointer shadow-sm"
        >
          <GithubIcon className="w-3.5 h-3.5 text-text-primary shrink-0" />
          <span className="hidden sm:inline">GitHub</span>
          <ChevronDown className={`w-3 h-3 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 mt-2 w-72 bg-background-surface border border-border-panel rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted border-b border-border-subtle bg-background-base/50">
              Select Repository
            </div>
            {REPOS.map((item) => (
              <a
                key={item.key}
                role="menuitem"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-background-base transition-colors border-b last:border-b-0 border-border-subtle group"
              >
                <div className="flex items-center gap-2.5">
                  <img src={item.icon} alt="" width={16} height={16} className="h-4 w-4 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-text-primary group-hover:text-signalBlue transition-colors flex items-center gap-1">
                      {item.name}
                      <span className="text-[10px] text-text-muted font-normal font-mono">({item.repo})</span>
                    </div>
                    <div className="text-[11px] text-text-muted leading-tight">{item.description}</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-signalBlue transition-colors shrink-0" />
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Hero variant
  return (
    <div className="relative font-sans w-full sm:w-auto" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="View on GitHub"
        onClick={() => setOpen((v) => !v)}
        className="w-full sm:w-auto h-12 px-6 sm:px-8 inline-flex items-center justify-center gap-2 border border-border-panel text-text-primary font-medium rounded-full hover:bg-background-surface transition-colors cursor-pointer"
      >
        <GithubIcon className="w-4 h-4 text-text-primary shrink-0" aria-hidden />
        <span>View on GitHub</span>
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-1/2 sm:left-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 mt-2 w-80 bg-background-surface border border-border-panel rounded-2xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-text-muted border-b border-border-subtle bg-background-base/50">
            Choose Repository
          </div>
          {REPOS.map((item) => {
            const isPreferred = language === item.key;
            return (
              <a
                key={item.key}
                role="menuitem"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-background-base transition-colors border-b last:border-b-0 border-border-subtle group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-background-base border border-border-soft flex items-center justify-center shrink-0 mt-0.5">
                    <img src={item.icon} alt="" width={18} height={18} className="h-4.5 w-4.5 object-contain" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary group-hover:text-signalBlue transition-colors flex items-center gap-1.5">
                      {item.name}
                      {isPreferred && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-signalBlue/15 text-signalBlue rounded-full font-normal">
                          active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">{item.description}</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-signalBlue transition-colors shrink-0" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
