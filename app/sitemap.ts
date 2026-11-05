import type { MetadataRoute } from 'next';
import { tsSource, pySource } from '@/lib/source';

const BASE_URL = 'https://docs.nitrostack.ai';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/python`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
  ];

  const tsEntries: MetadataRoute.Sitemap = tsSource.getPages().map((page) => {
    let priority = 0.8;
    if (page.url.includes('getting-started') || page.url.includes('quickstart')) {
      priority = 0.95;
    } else if (page.url.includes('sdk')) {
      priority = 0.85;
    }

    return {
      url: `${BASE_URL}${page.url}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority,
    };
  });

  const pyEntries: MetadataRoute.Sitemap = pySource.getPages().map((page) => {
    let priority = 0.8;
    if (page.url.includes('getting-started') || page.url.includes('quickstart')) {
      priority = 0.95;
    } else if (page.url.includes('sdk')) {
      priority = 0.85;
    }

    return {
      url: `${BASE_URL}${page.url}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority,
    };
  });

  return [...staticEntries, ...tsEntries, ...pyEntries];
}
