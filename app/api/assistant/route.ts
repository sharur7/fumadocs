import { getLLMText, pySource, tsSource, type DocPage } from '@/lib/source';
import { searchApi } from '@/lib/search-server';

/**
 * Docs assistant endpoint.
 *
 * POST { messages: { role, content }[], page?: { title, url } }
 * Streams the answer back as plain text (Markdown). The pages the answer is
 * based on are sent in the `x-assistant-sources` header.
 *
 * With GROQ_API_KEY set, answers come from a Groq-hosted model grounded in
 * the current page and the best-matching docs pages. Without it, the route
 * replies with the matching pages so the UI can be used end to end.
 */

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type Body = { messages?: ChatMessage[]; page?: { title: string; url: string } | null };
type Source = { title: string; url: string; description?: string; section?: string };

const MAX_SOURCES = 4;
const MAX_CHARS_PER_PAGE = 7000;
const MAX_HISTORY = 8;

function findPage(url: string): DocPage | undefined {
  const path = url.split('#')[0];
  return (
    tsSource.getPages().find((p) => p.url === path) ?? pySource.getPages().find((p) => p.url === path)
  );
}

const STOP_WORDS = new Set(
  `a an and are as at be but by can could do does for from get got have how i if in into is it its me my of on or
  please show so tell that the their them then there these this to use using want was we what when where which who
  why will with would you your about page example code key steps step summarize explain give work works`.split(/\s+/),
);

function keywords(question: string) {
  return [
    ...new Set(
      question
        .toLowerCase()
        .replace(/[^\p{L}\p{N}@./-]+/gu, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 1 && !STOP_WORDS.has(w)),
    ),
  ];
}

/**
 * Finds the pages most relevant to a question: the page the user is reading
 * first, then pages ranked by how often they match the question's keywords.
 */
async function retrieve(question: string, pageUrl?: string): Promise<DocPage[]> {
  const terms = keywords(question);
  const scores = new Map<string, number>();
  const bump = (url: string, by: number) => {
    const path = url.split('#')[0];
    scores.set(path, (scores.get(path) ?? 0) + by);
  };

  const queries: [string, number][] = [];
  if (terms.length > 1) queries.push([terms.join(' '), 3]);
  for (const t of terms.slice(0, 6)) queries.push([t, 1]);

  const results = await Promise.all(queries.map(([q]) => searchApi.search(q).catch(() => [])));
  results.forEach((list, i) => {
    const weight = queries[i][1];
    list.slice(0, 12).forEach((r, rank) => {
      // Title matches and higher-ranked results count for more.
      bump(r.url, weight * (r.type === 'page' ? 2 : 1) * (1 - rank / 16));
    });
  });

  // Pages whose title names a keyword are usually the best answer.
  for (const url of scores.keys()) {
    const title = findPage(url)?.data.title.toLowerCase() ?? '';
    const hits = terms.filter((t) => title.includes(t)).length;
    if (hits) bump(url, hits * 4);
  }

  const pages: DocPage[] = [];
  const add = (p?: DocPage) => {
    if (p && !pages.some((x) => x.url === p.url)) pages.push(p);
  };
  if (pageUrl) add(findPage(pageUrl));
  [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([url]) => pages.length < MAX_SOURCES && add(findPage(url)));
  return pages;
}

const SEGMENT_NAMES: Record<string, string> = {
  sdk: 'SDK',
  cli: 'CLI',
  mcp: 'MCP',
  api: 'API',
  'api-reference': 'API Reference',
  oauth: 'OAuth',
  ui: 'UI',
};

function titleize(segment: string) {
  return (
    SEGMENT_NAMES[segment] ??
    segment
      .split('-')
      .map((w) => SEGMENT_NAMES[w] ?? w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
}

/** Where a page sits, e.g. "Cloud › MCP", so pages with the same title can be told apart. */
function sectionOf(p: DocPage) {
  const isIndex = /(^|\/)index\.mdx?$/.test(p.path);
  const parents = isIndex ? p.slugs : p.slugs.slice(0, -1);
  const crumbs = parents.filter((s) => s !== 'apps' && s !== 'typescript').map(titleize);
  if (p.url.startsWith('/python')) crumbs.unshift('Python');
  return crumbs.slice(-2).join(' › ');
}

function toSource(p: DocPage): Source {
  return { title: p.data.title, url: p.url, description: p.data.description, section: sectionOf(p) };
}

const SYSTEM_PROMPT = `You are the NitroStack documentation assistant. NitroStack is an open-source TypeScript and Python framework for building MCP (Model Context Protocol) servers, with NitroStudio (a desktop app for building and testing MCP servers) and NitroCloud (hosting for MCP servers and NitroChat apps).

Answer using only the documentation excerpts provided. If they don't cover the question, say so plainly and point to the closest relevant page. Never invent APIs, options, commands, or prices.

Format every answer in clean Markdown:
- Start with a one- or two-sentence direct answer.
- Use short "###" headings only when the answer has several parts.
- Use numbered lists for steps and bullet lists for options.
- Put commands and code in fenced code blocks with a language tag (ts, py, bash, json).
- Use tables when comparing options.
- Link to docs pages with their relative URL, for example [Quickstart](/docs/getting-started/quickstart).
Keep answers concise and practical.`;

function chunked(text: string) {
  const encoder = new TextEncoder();
  const parts = text.match(/\S+\s*/g) ?? [text];
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const part of parts) {
        controller.enqueue(encoder.encode(part));
        await new Promise((r) => setTimeout(r, 12));
      }
      controller.close();
    },
  });
}

function fallbackAnswer(question: string, pages: DocPage[]) {
  const lines = [
    '> The assistant isn’t connected to a language model yet, so this reply lists the docs pages that match your question.',
    '',
  ];
  if (pages.length === 0) {
    lines.push(`I couldn’t find a page that matches **${question}**. Try different words, or browse the [Overview](/docs/getting-started/overview).`);
  } else {
    lines.push(`### Pages about “${question.length > 80 ? `${question.slice(0, 80)}…` : question}”`, '');
    pages.forEach((p, i) => {
      const section = sectionOf(p);
      lines.push(
        `${i + 1}. **[${p.data.title}](${p.url})**${section ? ` · ${section}` : ''}${p.data.description ? ` — ${p.data.description}` : ''}`,
      );
    });
  }
  return lines.join('\n');
}

const isGptOss = (model: string) => model.startsWith('openai/gpt-oss');

async function groqStream(messages: ChatMessage[], pages: DocPage[], page?: Body['page']) {
  const context = await Promise.all(
    pages.map(async (p) => {
      const text = (await getLLMText(p)).slice(0, MAX_CHARS_PER_PAGE);
      return `<page title="${p.data.title}" url="${p.url}">\n${text}\n</page>`;
    }),
  );

  const scope = page ? `The user is reading the page "${page.title}" (${page.url}). Prefer it when it's relevant.\n\n` : '';

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      stream: true,
      temperature: 1,
      top_p: 1,
      max_completion_tokens: 4096,
      // gpt-oss models think before answering; keep that out of the reply.
      ...(isGptOss(process.env.GROQ_MODEL || 'openai/gpt-oss-120b')
        ? { reasoning_effort: 'medium', include_reasoning: false }
        : {}),
      messages: [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\n${scope}Documentation excerpts:\n\n${context.join('\n\n')}` },
        ...messages.slice(-MAX_HISTORY),
      ],
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Groq request failed: ${res.status} ${await res.text().catch(() => '')}`);
  }

  // Turn the OpenAI-style SSE stream into plain text.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';
  return res.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const data = line.replace(/^data:\s*/, '').trim();
          if (!data || data === '[DONE]') continue;
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          } catch {
            // Ignore keep-alives and partial lines.
          }
        }
      },
    }),
  );
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim(),
  );
  const question = [...messages].reverse().find((m) => m.role === 'user')?.content.trim();
  if (!question) return new Response('Missing question', { status: 400 });

  const pages = await retrieve(question, body.page?.url);
  const headers = {
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'no-store',
    'x-assistant-sources': encodeURIComponent(JSON.stringify(pages.map(toSource))),
  };

  if (!process.env.GROQ_API_KEY) {
    return new Response(chunked(fallbackAnswer(question, pages)), { headers });
  }

  try {
    return new Response(await groqStream(messages, pages, body.page), { headers });
  } catch (err) {
    console.error('[assistant]', err);
    return new Response(chunked('Sorry, the assistant couldn’t answer right now. Please try again in a moment.'), {
      headers,
    });
  }
}
