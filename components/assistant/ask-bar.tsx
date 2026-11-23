'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { assistant, useAssistant, type AssistantPage } from './store';
import { useModKey } from './use-mod-key';

/**
 * "Ask a question…" bar pinned to the bottom of every docs page. Questions
 * asked here open the assistant panel and are scoped to the current page.
 */
export function AskBar({ page }: { page: AssistantPage }) {
  const open = useAssistant((s) => s.open);
  const busy = useAssistant((s) => s.busy);
  const [value, setValue] = useState('');
  const mod = useModKey();

  // Scope the assistant to the page being read.
  useEffect(() => {
    assistant.setPage(page);
  }, [page.url, page.title]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = () => {
    if (!value.trim() || busy) {
      if (!value.trim()) assistant.open({ page });
      return;
    }
    void assistant.ask(value, page);
    setValue('');
  };

  return (
    <div className="nx-askbar-wrap" data-hidden={open || undefined}>
      <form
        className="nx-askbar"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <div className="nx-askbar-top">
          <Sparkles className="nx-askbar-icon" aria-hidden />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask a question…"
            aria-label={`Ask a question about ${page.title}`}
            tabIndex={open ? -1 : undefined}
          />
        </div>
        <div className="nx-askbar-row">
          <kbd className="nx-askbar-kbd" aria-hidden>
            {mod}I
          </kbd>
          <button type="submit" className="nx-ai-send" aria-label="Ask" tabIndex={open ? -1 : undefined} disabled={!value.trim()}>
            <ArrowUp />
          </button>
        </div>
      </form>
    </div>
  );
}
