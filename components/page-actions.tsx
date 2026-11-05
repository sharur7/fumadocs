'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Check, ChevronDown, ExternalLink, FileText, Link2, ListTree, Sparkles } from 'lucide-react';
import { BASE_URL } from '@/lib/language';
import { docsIndexUrl, llmPrompt, pageMarkdownUrl } from '@/components/copy-docs-for-llm';

type MenuItem =
  | { kind: 'copy'; title: string; description: string; icon: ReactNode; value: string }
  | { kind: 'link'; title: string; description: string; icon: ReactNode; href: string };

/**
 * One "Copy page" split button shown next to the page title.
 * The main button copies the page as Markdown; the menu gathers the
 * LLM helpers that used to live in separate buttons (same text and URLs).
 */
export function PageActions({ markdownUrl, copyButton }: { markdownUrl: string; copyButton: ReactNode }) {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [origin, setOrigin] = useState(BASE_URL);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
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

  const absoluteMarkdownUrl = new URL(markdownUrl, origin).toString();
  const openPrompt = `Read ${absoluteMarkdownUrl}, I want to ask questions about it.`;
  const indexUrl = docsIndexUrl(pathname, origin);
  const pageMdUrl = pageMarkdownUrl(pathname, origin);

  const copyItems: MenuItem[] = [
    { kind: 'copy', title: 'Copy for LLM', description: 'Prompt with /llms.txt and this page', icon: <Sparkles />, value: llmPrompt(pathname, origin) },
    { kind: 'copy', title: 'Copy docs index', description: indexUrl, icon: <ListTree />, value: indexUrl },
    ...(pageMdUrl ? [{ kind: 'copy' as const, title: 'Copy page .md URL', description: 'Raw Markdown for this page', icon: <Link2 />, value: pageMdUrl }] : []),
  ];

  const linkItems: MenuItem[] = [
    { kind: 'link', title: 'View as Markdown', description: 'Open the raw page source', icon: <FileText />, href: markdownUrl },
    { kind: 'link', title: 'Open llms.txt', description: 'Full docs index for agents', icon: <ListTree />, href: indexUrl },
    { kind: 'link', title: 'Open in ChatGPT', description: 'Ask questions about this page', icon: <ExternalLink />, href: `https://chatgpt.com/?${new URLSearchParams({ hints: 'search', q: openPrompt })}` },
    { kind: 'link', title: 'Open in Claude', description: 'Ask questions about this page', icon: <ExternalLink />, href: `https://claude.ai/new?${new URLSearchParams({ q: openPrompt })}` },
    { kind: 'link', title: 'Open in Cursor', description: 'Ask questions about this page', icon: <ExternalLink />, href: `https://cursor.com/link/prompt?${new URLSearchParams({ text: openPrompt })}` },
  ];

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  const renderItem = (item: MenuItem) => {
    const inner = (
      <>
        <span className="nx-menu-icon">{copiedKey === item.title ? <Check /> : item.icon}</span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-fd-foreground">
            {copiedKey === item.title ? 'Copied' : item.title}
          </span>
          <span className="block truncate text-xs text-fd-muted-foreground">{item.description}</span>
        </span>
      </>
    );
    return item.kind === 'copy' ? (
      <button key={item.title} type="button" role="menuitem" className="nx-menu-item" onClick={() => copy(item.title, item.value)}>
        {inner}
      </button>
    ) : (
      <a key={item.title} role="menuitem" className="nx-menu-item" href={item.href} target="_blank" rel="noreferrer noopener">
        {inner}
      </a>
    );
  };

  return (
    <div ref={rootRef} className="nx-page-actions relative not-prose">
      <div className="nx-split">
        {copyButton}
        <button
          type="button"
          aria-label="More page actions"
          aria-haspopup="menu"
          aria-expanded={open}
          className="nx-split-toggle"
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronDown className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div role="menu" className="nx-menu">
          <div className="nx-menu-label">Copy</div>
          {copyItems.map(renderItem)}
          <div className="nx-menu-sep" />
          <div className="nx-menu-label">Open</div>
          {linkItems.map(renderItem)}
        </div>
      )}
    </div>
  );
}

