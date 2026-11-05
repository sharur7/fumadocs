'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Copy, ExternalLink, Sparkles } from 'lucide-react';
import {
  SKILLS_GITHUB_URLS,
  SKILLS_INSTALL_COMMANDS,
  type DocsLanguage,
} from '@/lib/language';

const SKILLS_OPTIONS: {
  key: DocsLanguage;
  name: string;
  command: string;
  url: string;
  icon: string;
  description: string;
}[] = [
  {
    key: 'typescript',
    name: 'TypeScript',
    command: SKILLS_INSTALL_COMMANDS.typescript,
    url: SKILLS_GITHUB_URLS.typescript,
    icon: '/languages/typescript.svg',
    description: 'Core MCP tools, guards & lifecycle skills',
  },
  {
    key: 'python',
    name: 'Python',
    command: SKILLS_INSTALL_COMMANDS.python,
    url: SKILLS_GITHUB_URLS.python,
    icon: '/languages/python.svg',
    description: 'Python MCP SDK & Pydantic tools skills',
  },
];

export function InstallSkillsButton({ language }: { language: DocsLanguage }) {
  const [open, setOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<DocsLanguage | null>(null);
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

  async function copyCommand(key: DocsLanguage, command: string) {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      window.open(SKILLS_GITHUB_URLS[key], '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div className="relative font-sans w-full sm:w-auto" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Install Agent Skills options"
        onClick={() => setOpen((v) => !v)}
        className="w-full sm:w-auto h-12 px-6 sm:px-8 inline-flex items-center justify-center gap-2 border border-border-panel text-text-primary font-medium rounded-full hover:bg-background-surface transition-colors cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-coolMint shrink-0" aria-hidden />
        <span>Install Agent Skills</span>
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-1/2 sm:left-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 mt-2 w-88 bg-background-surface border border-border-panel rounded-2xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-text-muted border-b border-border-subtle bg-background-base/50 flex items-center justify-between">
            <span>Select Agent Skills</span>
            <span className="text-[10px] lowercase text-text-muted font-mono">click to copy</span>
          </div>

          {SKILLS_OPTIONS.map((item) => {
            const isCopied = copiedKey === item.key;
            const isPreferred = language === item.key;

            return (
              <div
                key={item.key}
                className="p-3.5 border-b last:border-b-0 border-border-subtle hover:bg-background-base/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img src={item.icon} alt="" width={16} height={16} className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                      {item.name}
                      {isPreferred && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-signalBlue/15 text-signalBlue rounded-full font-normal">
                          active
                        </span>
                      )}
                    </span>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`View ${item.name} skills on GitHub`}
                    className="text-text-muted hover:text-text-primary transition-colors p-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-[11px] text-text-muted mb-2 leading-snug">{item.description}</p>

                <div className="flex items-center gap-2 bg-background-base border border-border-panel rounded-lg p-1.5 font-mono text-xs">
                  <span className="flex-1 truncate text-text-secondary select-all pl-1 text-[11px]">
                    {item.command}
                  </span>
                  <button
                    type="button"
                    onClick={() => void copyCommand(item.key, item.command)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-signalBlue/15 hover:bg-signalBlue/25 text-signalBlue font-medium text-[11px] transition-colors cursor-pointer shrink-0"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-status-success" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
