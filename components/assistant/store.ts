'use client';

import { useSyncExternalStore } from 'react';

/**
 * Shared state for the docs assistant.
 *
 * The search dialog is rendered by Fumadocs' RootProvider, outside the page
 * tree, so a React context can't reach it. A tiny external store lets the
 * search dialog, the navbar button, the bottom ask bar and the panel share
 * one conversation.
 */

export type AssistantSource = { title: string; url: string; description?: string; section?: string };

export type AssistantMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Pages the answer was based on. */
  sources?: AssistantSource[];
  status?: 'streaming' | 'done' | 'error';
  /** Page the question was asked from, shown above the question. */
  page?: AssistantPage;
};

export type AssistantPage = { title: string; url: string };

type State = {
  open: boolean;
  expanded: boolean;
  messages: AssistantMessage[];
  busy: boolean;
  /** Page the user is reading; questions are scoped to it until removed. */
  page: AssistantPage | null;
  /** Bumped to ask the composer to take focus. */
  focusTick: number;
};

let state: State = {
  open: false,
  expanded: false,
  messages: [],
  busy: false,
  page: null,
  focusTick: 0,
};

const listeners = new Set<() => void>();
let controller: AbortController | null = null;

function set(patch: Partial<State> | ((s: State) => Partial<State>)) {
  const next = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;

export function useAssistant<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getSnapshot()),
  );
}

const uid = () => Math.random().toString(36).slice(2, 10);

function decodeSources(header: string | null): AssistantSource[] {
  if (!header) return [];
  try {
    return JSON.parse(decodeURIComponent(header)) as AssistantSource[];
  } catch {
    return [];
  }
}

export const assistant = {
  open(options: { page?: AssistantPage | null; focus?: boolean } = {}) {
    set((s) => ({
      open: true,
      page: options.page === undefined ? s.page : options.page,
      focusTick: options.focus === false ? s.focusTick : s.focusTick + 1,
    }));
  },
  close() {
    set({ open: false, expanded: false });
  },
  toggle(page?: AssistantPage | null) {
    if (state.open) assistant.close();
    else assistant.open({ page });
  },
  setExpanded(expanded: boolean) {
    set({ expanded });
  },
  setPage(page: AssistantPage | null) {
    set({ page });
  },
  clear() {
    controller?.abort();
    set({ messages: [], busy: false });
  },
  stop() {
    controller?.abort();
  },
  /** Re-ask the last question, replacing its answer. */
  retry() {
    if (state.busy) return;
    const idx = state.messages.map((m) => m.role).lastIndexOf('user');
    if (idx < 0) return;
    const question = state.messages[idx];
    set({ messages: state.messages.slice(0, idx) });
    void assistant.ask(question.content, question.page ?? null);
  },
  async ask(question: string, page?: AssistantPage | null) {
    const text = question.trim();
    if (!text || state.busy) return;

    const scope = page === undefined ? state.page : page;
    const userMsg: AssistantMessage = { id: uid(), role: 'user', content: text, page: scope ?? undefined };
    const reply: AssistantMessage = { id: uid(), role: 'assistant', content: '', status: 'streaming' };
    const history = [...state.messages, userMsg];

    set({ open: true, busy: true, messages: [...history, reply] });

    const update = (patch: Partial<AssistantMessage>) =>
      set((s) => ({
        messages: s.messages.map((m) => (m.id === reply.id ? { ...m, ...patch } : m)),
      }));

    controller = new AbortController();
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          page: scope,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error(`Request failed (${res.status})`);
      update({ sources: decodeSources(res.headers.get('x-assistant-sources')) });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let content = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        content += decoder.decode(value, { stream: true });
        update({ content });
      }
      update({ status: 'done' });
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        update({ status: 'done' });
      } else {
        update({
          status: 'error',
          content: "Something went wrong while answering. Please try again in a moment.",
        });
      }
    } finally {
      controller = null;
      set({ busy: false });
    }
  },
};
