'use client';

import Link from 'next/link';
import { isValidElement, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { createMarkdownRenderer } from 'fumadocs-core/content/md';
import { remarkGfm } from 'fumadocs-core/mdx-plugins/remark-gfm';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

const { Markdown } = createMarkdownRenderer({ remarkPlugins: [remarkGfm] });

function codeOf(children: ReactNode): { code: string; lang: string } | null {
  if (!isValidElement(children)) return null;
  const el = children as ReactElement<{ className?: string; children?: ReactNode }>;
  const lang = /language-([\w-]+)/.exec(el.props.className ?? '')?.[1] ?? 'text';
  const code = typeof el.props.children === 'string' ? el.props.children : String(el.props.children ?? '');
  return { code: code.replace(/\n$/, ''), lang };
}

function AnswerLink({ href = '', children, ...props }: ComponentProps<'a'>) {
  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
      {children}
    </a>
  );
}

/**
 * Renders an assistant reply as formatted Markdown: headings, lists, tables,
 * inline code and syntax-highlighted code blocks with a copy button.
 * While the reply is still streaming, code blocks render as plain text so
 * the highlighter isn't re-run on every chunk.
 */
export function AssistantAnswer({ content, streaming }: { content: string; streaming?: boolean }) {
  return (
    <div className="nx-ai-prose">
      <Markdown
        components={{
          a: AnswerLink,
          pre: ({ children, ...props }) => {
            const block = codeOf(children);
            if (!block || streaming) return <pre {...props}>{children}</pre>;
            return (
              <DynamicCodeBlock
                lang={block.lang}
                code={block.code}
                codeblock={{ className: 'nx-ai-code', allowCopy: true }}
              />
            );
          },
          table: (props) => (
            <div className="nx-ai-table">
              <table {...props} />
            </div>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
