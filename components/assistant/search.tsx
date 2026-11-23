'use client';

import { useMemo, type ComponentProps } from 'react';
import { Sparkles } from 'lucide-react';
import { useDocsSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SearchItemType,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { FullSearchTrigger, SearchTrigger } from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { assistant } from './store';
import { useModKey } from './use-mod-key';

/** The ✦ button that opens the assistant. */
export function AskAiButton({ className = '', ...props }: ComponentProps<'button'>) {
  const mod = useModKey();
  return (
    <button
      type="button"
      aria-label="Ask the assistant"
      title={`Ask the assistant (${mod}I)`}
      {...props}
      className={`nx-ai-trigger ${className}`}
      onClick={() => assistant.toggle()}
    >
      <Sparkles aria-hidden />
      <span className="nx-ai-trigger-label">Ask AI</span>
    </button>
  );
}

/** Navbar search box with the assistant button beside it (desktop). */
export function SearchWithAssistant({ className, hideIfDisabled }: ComponentProps<typeof FullSearchTrigger>) {
  return (
    <div className={`nx-search-ai flex items-center gap-2 ${className ?? ''}`}>
      <FullSearchTrigger hideIfDisabled={hideIfDisabled} className="nx-search-ai-field" />
      <AskAiButton />
    </div>
  );
}

/** Search and assistant icons for the compact (mobile) navbar. */
export function SearchWithAssistantSm({ className, hideIfDisabled }: ComponentProps<typeof SearchTrigger>) {
  return (
    <>
      <SearchTrigger hideIfDisabled={hideIfDisabled} className={className} />
      <AskAiButton className="nx-ai-trigger-sm" />
    </>
  );
}

function AskItem({ query }: { query: string }) {
  return (
    <span className="nx-search-ask">
      <Sparkles aria-hidden />
      {query ? (
        <span>
          Can you tell me about <strong>{query}</strong>?
        </span>
      ) : (
        <span>Ask the assistant a question</span>
      )}
    </span>
  );
}

/**
 * The ⌘K search dialog, with a way into the assistant: an "Ask Assistant"
 * button in the header and an "Ask Assistant" result under the matches.
 */
export function AssistantSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({ type: 'fetch', api: '/api/search', delayMs: 120 });
  const mod = useModKey();

  const askFromSearch = () => {
    const q = search.trim();
    props.onOpenChange(false);
    if (q) void assistant.ask(`Can you tell me about ${q}?`);
    else assistant.open();
  };

  const items = useMemo<SearchItemType[] | null>(() => {
    const q = search.trim();
    const ask: SearchItemType = {
      id: 'ask-assistant',
      type: 'action',
      node: <AskItem query={q} />,
      onSelect: () => {
        if (q) void assistant.ask(`Can you tell me about ${q}?`);
        else assistant.open();
      },
    };
    const results = query.data !== 'empty' && query.data ? query.data : [];
    if (!q) return [ask];
    return [...results, ask];
  }, [query.data, search]);

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <button type="button" className="nx-search-ask-btn" onClick={askFromSearch}>
            <Sparkles aria-hidden />
            Ask Assistant
            <kbd>{mod}I</kbd>
          </button>
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={items} />
        <SearchDialogFooter className="nx-search-footer">
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> to navigate
        </span>
        <span>
          <kbd>Enter</kbd> to open
        </span>
          <span>
            <kbd>Esc</kbd> to close
          </span>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
