import { typescriptDocs, pythonDocs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute, pythonContentRoute, pythonImageRoute, pythonRoute } from './shared';

export const tsSource = loader({
  baseUrl: docsRoute,
  source: typescriptDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const pySource = loader({
  baseUrl: pythonRoute,
  source: pythonDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// Alias for default TypeScript source
export const source = tsSource;

export type DocPage = (typeof tsSource)['$inferPage'] | (typeof pySource)['$inferPage'];

export function getSourceByLanguage(language: 'typescript' | 'python') {
  return language === 'python' ? pySource : tsSource;
}

export function getPageImage(page: DocPage) {
  const isPython = page.url.startsWith('/python');
  const baseImage = isPython ? pythonImageRoute : docsImageRoute;
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${baseImage}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: DocPage) {
  const isPython = page.url.startsWith('/python');
  const baseContent = isPython ? pythonContentRoute : docsContentRoute;
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${baseContent}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: DocPage) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}

