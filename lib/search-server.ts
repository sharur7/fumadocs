import { pySource, tsSource } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';

/**
 * Search index over the TypeScript and Python docs. Used by the ⌘K search
 * route (`/api/search`) and by the assistant to find relevant pages.
 */
export const searchApi = createSearchAPI('advanced', {
  language: 'english',
  indexes: async () => {
    const tsPages = tsSource.getPages().map((page) => ({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      structuredData: page.data.structuredData,
    }));

    const pyPages = pySource.getPages().map((page) => ({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      structuredData: page.data.structuredData,
    }));

    return [...tsPages, ...pyPages];
  },
});
