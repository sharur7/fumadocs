'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Check, ChevronDown, Copy, ExternalLink } from 'lucide-react';
import { BASE_URL, languageFromPathname } from '@/lib/language';

export function pageMarkdownUrl(pathname: string, origin: string): string | null {
  if (!pathname || pathname === '/') return null;
  const slug = pathname.replace(/\/$/, '');
  if (slug === '/python') return `${origin}/python`;
  return `${origin}${slug}.md`;
}

export function docsIndexUrl(pathname: string, origin: string): string {
  return languageFromPathname(pathname) === 'python'
    ? `${origin}/python/llms.txt`
    : `${origin}/llms.txt`;
}

export function llmPrompt(pathname: string, origin: string): string {
  const indexUrl = docsIndexUrl(pathname, origin);
  const pageUrl = pageMarkdownUrl(pathname, origin);
  if (pageUrl && pageUrl.endsWith('.md')) {
    return `Read ${indexUrl} as the NitroStack documentation index. For this page, prefer ${pageUrl}.`;
  }
  return `Read ${indexUrl} as the NitroStack documentation index. Prefer each page's .md URL when ingesting.`;
}

export function CopyDocsForLlm() {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState(BASE_URL);
  const rootRef = useRef<HTMLDivElement>(null);
  const indexUrl = docsIndexUrl(pathname, origin);
  const pageUrl = pageMarkdownUrl(pathname, origin);
  const prompt = llmPrompt(pathname, origin);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

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

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy docs for LLMs:', err);
    }
  }

  return (
    <div className="relative font-sans" ref={rootRef}>
      <div className="flex items-stretch h-8 rounded-[9px] border border-fd-border bg-fd-background shadow-sm overflow-hidden transition-colors hover:border-[var(--nx-brand-ring)]">
        <button
          type="button"
          title="Copy docs for LLMs"
          onClick={() => copyText(prompt)}
          className="flex items-center gap-1.5 px-2.5 text-xs font-medium text-fd-foreground hover:bg-fd-accent transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-status-success shrink-0" /> : <Copy className="w-3.5 h-3.5 text-brand shrink-0" />}
          <span className="hidden md:inline">{copied ? 'Copied' : 'Copy for LLM'}</span>
        </button>
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="More LLM copy options"
          onClick={() => setOpen((v) => !v)}
          className="px-1.5 border-l border-fd-border text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground transition-colors cursor-pointer"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 bg-fd-popover border border-fd-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              copyText(prompt);
              setOpen(false);
            }}
            className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-fd-accent transition-colors border-b border-fd-border cursor-pointer"
          >
            <Copy className="w-4 h-4 mt-0.5 text-text-muted shrink-0" />
            <span>
              <span className="block text-sm font-medium text-text-primary">Copy for LLM</span>
              <span className="block text-xs text-text-muted">Prompt with /llms.txt and this page</span>
            </span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              copyText(indexUrl);
              setOpen(false);
            }}
            className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-fd-accent transition-colors border-b border-fd-border cursor-pointer"
          >
            <Copy className="w-4 h-4 mt-0.5 text-text-muted shrink-0" />
            <span>
              <span className="block text-sm font-medium text-text-primary">Copy docs index</span>
              <span className="block text-xs text-text-muted">{indexUrl}</span>
            </span>
          </button>
          {pageUrl?.endsWith('.md') && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                copyText(pageUrl);
                setOpen(false);
              }}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-fd-accent transition-colors border-b border-fd-border cursor-pointer"
            >
              <Copy className="w-4 h-4 mt-0.5 text-text-muted shrink-0" />
              <span>
                <span className="block text-sm font-medium text-text-primary">Copy page .md URL</span>
                <span className="block text-xs text-text-muted">Raw Markdown for this page</span>
              </span>
            </button>
          )}
          <a
            role="menuitem"
            href={languageFromPathname(pathname) === 'python' ? '/python/llms.txt' : '/llms.txt'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-start gap-3 px-4 py-3 hover:bg-fd-accent transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 mt-0.5 text-text-muted shrink-0" />
            <span>
              <span className="block text-sm font-medium text-text-primary">Open llms.txt</span>
              <span className="block text-xs text-text-muted">Full docs index for agents</span>
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
