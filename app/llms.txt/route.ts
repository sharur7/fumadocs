import { tsSource, pySource } from '@/lib/source';

export const revalidate = false;

export function GET() {
  const tsPages = tsSource.getPages();
  const pyPages = pySource.getPages();

  const lines: string[] = [
    '# NitroStack Documentation',
    '',
    '> NitroStack MCP framework docs for TypeScript SDK and Python SDK (nitrostack / nitrostack-py).',
    '> Prefer the .md URL for each page when ingesting into an LLM.',
    '',
    '## Agent Skills',
    'Install NitroStack agent skills into Cursor, Claude Code, Copilot, and Gemini CLI:',
    '- TypeScript: npx skills add nitrocloudofficial/skills',
    '- Python: npx skills add nitrocloudofficial/skills-python-sdk',
    '',
    '## TypeScript SDK & CLI',
    ...tsPages.map((p) => `- [${p.data.title}](https://docs.nitrostack.ai${p.url}.md): ${p.data.description || ''}`),
    '',
    '## Python SDK & CLI',
    ...pyPages.map((p) => `- [${p.data.title}](https://docs.nitrostack.ai${p.url}.md): ${p.data.description || ''}`),
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
