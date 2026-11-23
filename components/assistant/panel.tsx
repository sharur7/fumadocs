'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  ArrowUp,
  Check,
  Copy,
  FileText,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Square,
  Trash2,
  X,
} from 'lucide-react';
import { AssistantAnswer } from './answer';
import { assistant, useAssistant, type AssistantMessage } from './store';

const SUGGESTIONS = [
  'How do I deploy my MCP server?',
  'How do I create an API key?',
  'What is NitroStack?',
  'How does NitroStack work?',
];

/** True on the shortcut that toggles the assistant: ⌘I on macOS, Ctrl+I elsewhere. */
export function isAssistantHotkey(e: globalThis.KeyboardEvent) {
  return (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'i';
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="nx-ai-icon-btn"
      aria-label={done ? 'Copied' : 'Copy answer'}
      title={done ? 'Copied' : 'Copy answer'}
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        });
      }}
    >
      {done ? <Check /> : <Copy />}
    </button>
  );
}

function Thinking() {
  return (
    <span className="nx-ai-thinking" aria-label="Thinking">
      <span />
      <span />
      <span />
    </span>
  );
}

function Message({ message, onRetry }: { message: AssistantMessage; onRetry?: () => void }) {
  if (message.role === 'user') {
    return (
      <div className="nx-ai-msg nx-ai-msg-user">
        {message.page ? (
          <span className="nx-ai-msg-page">
            <FileText aria-hidden />
            {message.page.title}
          </span>
        ) : null}
        <div className="nx-ai-bubble">{message.content}</div>
      </div>
    );
  }

  const streaming = message.status === 'streaming';
  return (
    <div className="nx-ai-msg nx-ai-msg-assistant" aria-live={streaming ? 'polite' : undefined}>
      {message.content ? (
        <AssistantAnswer content={message.content} streaming={streaming} />
      ) : (
        <Thinking />
      )}

      {message.sources && message.sources.length > 0 && !streaming ? (
        <div className="nx-ai-sources">
          <p className="nx-ai-sources-label">Sources</p>
          <div className="nx-ai-sources-list">
            {message.sources.map((s) => (
              <Link key={s.url} href={s.url} className="nx-ai-source" onClick={() => assistant.close()}>
                <FileText aria-hidden />
                <span className="nx-ai-source-title">{s.title}</span>
                {s.section ? <span className="nx-ai-source-section">{s.section}</span> : null}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {!streaming && message.content ? (
        <div className="nx-ai-msg-actions">
          <CopyButton text={message.content} />
          {onRetry ? (
            <button type="button" className="nx-ai-icon-btn" aria-label="Ask again" title="Ask again" onClick={onRetry}>
              <RotateCcw />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function Composer({ autoFocusTick }: { autoFocusTick?: number }) {
  const page = useAssistant((s) => s.page);
  const busy = useAssistant((s) => s.busy);
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocusTick) ref.current?.focus();
  }, [autoFocusTick]);

  // Grow with the text, up to the max height set in CSS.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const send = () => {
    if (!value.trim() || busy) return;
    void assistant.ask(value);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  return (
    <form
      className="nx-ai-composer"
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
    >
      {page ? (
        <div className="nx-ai-context">
          <span className="nx-ai-chip" title={`Answers will focus on ${page.title}`}>
            <FileText aria-hidden />
            <span className="nx-ai-chip-text">{page.title}</span>
            <button type="button" aria-label="Don't focus on this page" onClick={() => assistant.setPage(null)}>
              <X />
            </button>
          </span>
        </div>
      ) : null}
      <textarea
        ref={ref}
        rows={1}
        value={value}
        placeholder={page ? 'Ask about this page…' : 'Ask a question…'}
        aria-label="Ask the assistant a question"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className="nx-ai-composer-row">
        {busy ? (
          <button type="button" className="nx-ai-send" aria-label="Stop answering" onClick={() => assistant.stop()}>
            <Square className="nx-ai-stop" />
          </button>
        ) : (
          <button type="submit" className="nx-ai-send" aria-label="Send" disabled={!value.trim()}>
            <ArrowUp />
          </button>
        )}
      </div>
    </form>
  );
}

export function AssistantPanel() {
  const open = useAssistant((s) => s.open);
  const expanded = useAssistant((s) => s.expanded);
  const messages = useAssistant((s) => s.messages);
  const focusTick = useAssistant((s) => s.focusTick);
  const busy = useAssistant((s) => s.busy);
  const scroller = useRef<HTMLDivElement>(null);

  // ⌘I / Ctrl+I toggles the assistant anywhere on the site.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (isAssistantHotkey(e)) {
        e.preventDefault();
        assistant.toggle();
      } else if (e.key === 'Escape' && open) {
        assistant.close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Dock the panel beside the page on wide screens.
  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute('data-assistant-open', open);
    root.toggleAttribute('data-assistant-expanded', open && expanded);
    return () => {
      root.removeAttribute('data-assistant-open');
      root.removeAttribute('data-assistant-expanded');
    };
  }, [open, expanded]);

  // Keep the newest message in view while it streams.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <>
      <div className="nx-ai-backdrop" data-open={open || undefined} onClick={() => assistant.close()} aria-hidden />
      <aside
        className="nx-ai-panel"
        data-open={open || undefined}
        data-expanded={expanded || undefined}
        role="dialog"
        aria-label="Assistant"
        aria-hidden={!open}
        inert={!open}
      >
        <header className="nx-ai-header">
          <div className="nx-ai-title">
            <Sparkles aria-hidden />
            Assistant
          </div>
          <div className="nx-ai-header-actions">
            <button
              type="button"
              className="nx-ai-icon-btn nx-ai-expand"
              aria-label={expanded ? 'Collapse' : 'Expand'}
              title={expanded ? 'Collapse' : 'Expand'}
              onClick={() => assistant.setExpanded(!expanded)}
            >
              {expanded ? <Minimize2 /> : <Maximize2 />}
            </button>
            <button
              type="button"
              className="nx-ai-icon-btn"
              aria-label="Clear chat"
              title="Clear chat"
              disabled={messages.length === 0}
              onClick={() => assistant.clear()}
            >
              <Trash2 />
            </button>
            <button type="button" className="nx-ai-icon-btn" aria-label="Close" title="Close (Esc)" onClick={() => assistant.close()}>
              <X />
            </button>
          </div>
        </header>

        <div className="nx-ai-body" ref={scroller}>
          <p className="nx-ai-disclaimer">Responses are generated using AI and may contain mistakes.</p>
          {messages.length > 0 ? (
            <div className="nx-ai-thread">
              {messages.map((m, i) => (
                <Message
                  key={m.id}
                  message={m}
                  onRetry={
                    m.role === 'assistant' && i === messages.length - 1 && !busy ? () => assistant.retry() : undefined
                  }
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="nx-ai-footer">
          {messages.length === 0 ? (
            <div className="nx-ai-suggestions">
              <p>Suggestions</p>
              {SUGGESTIONS.map((s) => (
                // General questions, so they aren't tied to the current page.
                <button key={s} type="button" onClick={() => void assistant.ask(s, null)}>
                  {s}
                </button>
              ))}
            </div>
          ) : null}
          <Composer autoFocusTick={open ? focusTick : 0} />
        </div>
      </aside>
    </>
  );
}
