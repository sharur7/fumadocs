export type DocsLanguage = 'typescript' | 'python';

export const BASE_URL = 'https://docs.nitrostack.ai';
export const LANGUAGE_STORAGE_KEY = 'nitrodocs-language';

export function persistDocsLanguage(language: DocsLanguage) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // ignore quota / private-mode failures
  }
}

export function readPersistedLanguage(): DocsLanguage | null {
  try {
    const value = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return value === 'python' || value === 'typescript' ? value : null;
  } catch {
    return null;
  }
}

export const GITHUB_URLS: Record<DocsLanguage, string> = {
  typescript: 'https://github.com/nitrocloudofficial/nitrostack',
  python: 'https://github.com/nitrocloudofficial/nitrostack-python-sdk',
};

export const SKILLS_GITHUB_URLS: Record<DocsLanguage, string> = {
  typescript: 'https://github.com/nitrocloudofficial/skills',
  python: 'https://github.com/nitrocloudofficial/skills-python-sdk',
};

export const SKILLS_INSTALL_COMMANDS: Record<DocsLanguage, string> = {
  typescript: 'npx skills add nitrocloudofficial/skills',
  python: 'npx skills add nitrocloudofficial/skills-python-sdk',
};

const TS_TO_PYTHON: Record<string, string> = {
  'cli/build': 'cli/pack',
  'cli/introduction': 'cli/overview',
  'sdk/file-uploads': 'sdk/widgets',
  'sdk/ui/widget-sdk': 'sdk/widgets',
  'sdk/ui/widget-manifest': 'sdk/widgets',
  'sdk/ui/widgets': 'sdk/widgets',
  'guides/widget-sdk-migration': 'sdk/widgets',
  'guides/widget-examples': 'sdk/widgets',
  'studio/studio-guide': 'studio/overview',
};

const PYTHON_TO_TS: Record<string, string> = {
  'cli/pack': 'cli/build',
  'cli/start': 'cli/dev',
  'cli/validate': 'cli/overview',
  'cli/register': 'cli/overview',
  'sdk/widgets': 'sdk/ui/widgets',
};

export function languageFromPathname(pathname: string): DocsLanguage {
  const path = pathname.replace(/\/$/, '') || '/';
  if (path === '/python' || path.startsWith('/python/')) return 'python';
  return 'typescript';
}

export function switchLanguagePath(pathname: string, target: DocsLanguage): string {
  const path = pathname.replace(/\/$/, '') || '/';

  if (target === 'python') {
    if (path === '/' || path === '/docs') return '/python';
    if (path.startsWith('/python')) return path;
    
    // strip /docs prefix if present
    const slug = path.startsWith('/docs/') ? path.slice('/docs/'.length) : path.slice(1);
    const mapped = TS_TO_PYTHON[slug] ?? slug;
    return `/python/${mapped}`;
  }

  // target is typescript
  if (path === '/python') return '/';
  if (!path.startsWith('/python')) return path;
  
  const slug = path.startsWith('/python/') ? path.slice('/python/'.length) : '';
  if (!slug) return '/docs';
  
  const mapped = PYTHON_TO_TS[slug] ?? slug;
  return `/docs/${mapped}`;
}

export function languageHome(language: DocsLanguage): string {
  return language === 'python' ? '/python' : '/';
}
