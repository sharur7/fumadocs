import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  async redirects() {
    return [
      { source: '/docs/api-reference/cli-commands', destination: '/docs/cli/cli-commands', permanent: true },
      // Studio pages replaced by the per-feature pages
      { source: '/docs/studio/testing', destination: '/docs/studio/tools', permanent: true },
      { source: '/docs/studio/standalone', destination: '/docs/studio/add-mcp-server', permanent: true },
      { source: '/docs/studio/studio-guide', destination: '/docs/studio/overview', permanent: true },
      // Python auth pages merged into sdk/auth
      { source: '/python/sdk/api-keys', destination: '/python/sdk/auth/api-key', permanent: true },
      { source: '/python/sdk/oauth-2.1', destination: '/python/sdk/auth/oauth', permanent: true },
      // Best practices and checklist pages removed
      { source: '/docs/sdk/best-practices', destination: '/docs/sdk', permanent: true },
      { source: '/python/sdk/best-practices', destination: '/docs/sdk', permanent: true },
      { source: '/docs/deployment/checklist', destination: '/docs/deployment/docker', permanent: true },
      { source: '/python/deployment/checklist', destination: '/python/deployment/docker', permanent: true },
      // Legacy redirects carried from nitrodocs
      { source: '/cli/installation', destination: '/docs/cli/installation', permanent: true },
      { source: '/cli/02-installation', destination: '/docs/cli/installation', permanent: true },
      { source: '/sdk/typescript/oauth-2.1-guide', destination: '/docs/sdk/typescript/11-oauth-authentication', permanent: true },
      { source: '/sdk/typescript/api-keys-guide', destination: '/docs/sdk/typescript/10-api-key-authentication', permanent: true },

      // Root path migrations to /docs/ prefix
      { source: '/quick-start', destination: '/docs/getting-started/quickstart', permanent: true },
      { source: '/quickstart', destination: '/docs/getting-started/quickstart', permanent: true },
      { source: '/installation', destination: '/docs/cli/installation', permanent: true },
      { source: '/intro', destination: '/docs/getting-started/overview', permanent: true },
      { source: '/introduction', destination: '/docs/getting-started/overview', permanent: true },
      { source: '/getting-started/:path*', destination: '/docs/getting-started/:path*', permanent: true },
      { source: '/cli/:path*', destination: '/docs/cli/:path*', permanent: true },
      { source: '/sdk/:path*', destination: '/docs/sdk/:path*', permanent: true },
      { source: '/studio/:path*', destination: '/docs/studio/:path*', permanent: true },
      { source: '/templates/:path*', destination: '/docs/templates/:path*', permanent: true },
      { source: '/deployment/cloud-platforms', destination: '/docs/deployment/cloud', permanent: true },
      { source: '/deployment/:path*', destination: '/docs/deployment/:path*', permanent: true },
      { source: '/guides/:path*', destination: '/docs/guides/:path*', permanent: true },
      { source: '/api/:slug(decorators|guards|middleware|interceptors|pipes|execution-context|cli-commands)', destination: '/docs/api-reference/:slug', permanent: true },
      { source: '/ai-agents/:path*', destination: '/docs/ai-agents/:path*', permanent: true },

      // In-section shortcut aliases (prevent 404s on direct URL access)
      { source: '/docs', destination: '/docs/getting-started/overview', permanent: true },
      { source: '/docs/installation', destination: '/docs/cli/installation', permanent: true },
      { source: '/docs/quickstart', destination: '/docs/getting-started/quickstart', permanent: true },
      { source: '/docs/quick-start', destination: '/docs/getting-started/quickstart', permanent: true },
      { source: '/docs/intro', destination: '/docs/getting-started/overview', permanent: true },
      { source: '/docs/introduction', destination: '/docs/getting-started/overview', permanent: true },
      // Python API reference and templates are merged into the shared pages (TypeScript/Python tabs)
      { source: '/python/api-reference/:slug(decorators|guards|middleware|interceptors|pipes|filters|execution-context|cli-commands)', destination: '/docs/api-reference/:slug', permanent: true },
      { source: '/python/templates/:slug(starter|oauth|pizzaz)', destination: '/docs/templates/:slug', permanent: true },
      // AI Agents section removed: quick references moved to the end of NitroStack SDK and NitroStack CLI
      { source: '/docs/ai-agents/sdk-reference', destination: '/docs/sdk/sdk-quick-reference', permanent: true },
      { source: '/docs/ai-agents/cli-reference', destination: '/docs/cli/cli-quick-reference', permanent: true },
      { source: '/docs/ai-agents', destination: '/docs/sdk/sdk-quick-reference', permanent: true },
      { source: '/docs/api-reference/guards/patterns', destination: '/docs/api-reference/guards/custom-guards', permanent: true },
      // CLI pages merged (keep old URLs working)
      { source: '/docs/cli/build', destination: '/docs/cli/build-and-ship', permanent: true },
      { source: '/docs/cli/start', destination: '/docs/cli/build-and-ship', permanent: true },
      { source: '/docs/cli/pack', destination: '/docs/cli/build-and-ship', permanent: true },
      { source: '/docs/cli/install', destination: '/docs/cli/manage-dependencies', permanent: true },
      { source: '/docs/cli/upgrade', destination: '/docs/cli/manage-dependencies', permanent: true },
      { source: '/docs/cli/cursor', destination: '/docs/guides/connect-to-clients', permanent: true },
      // Pages moved out of Getting Started (keep old URLs working)
      { source: '/docs/getting-started/mcp-basics', destination: '/docs/getting-started/core-concepts/mcp-basics', permanent: true },
      { source: '/docs/getting-started/introduction', destination: '/docs/getting-started/overview', permanent: true },
      { source: '/docs/getting-started/installation', destination: '/docs/cli/installation', permanent: true },
      { source: '/docs/getting-started/connect-to-clients', destination: '/docs/guides/connect-to-clients', permanent: true },
      { source: '/docs/getting-started/connect-your-coding-agent', destination: '/docs/guides/connect-your-coding-agent', permanent: true },
      { source: '/docs/deployment/cloud-platforms', destination: '/docs/deployment/cloud', permanent: true },
      { source: '/docs/sdk/typescript/:path*', destination: '/docs/sdk/:path*', permanent: true },
      { source: '/python/installation', destination: '/python/sdk/quick-start', permanent: true },
      { source: '/python/quickstart', destination: '/python/sdk/quick-start', permanent: true },
      { source: '/python/quick-start', destination: '/python/sdk/quick-start', permanent: true },
      { source: '/python/intro', destination: '/python/sdk/quick-start', permanent: true },
      { source: '/python/introduction', destination: '/python/sdk/quick-start', permanent: true },
      // Round 14: server pages move into Core Concepts; Python getting-started pages are removed
      { source: '/docs/sdk/server', destination: '/docs/getting-started/core-concepts/server-concepts', permanent: true },
      { source: '/docs/sdk/server/bootstrap', destination: '/docs/getting-started/core-concepts/bootstrap', permanent: true },
      { source: '/docs/sdk/server/modules', destination: '/docs/getting-started/core-concepts/modules', permanent: true },
      { source: '/docs/sdk/server/lifecycle', destination: '/docs/getting-started/core-concepts/server-lifecycle', permanent: true },
      { source: '/docs/sdk/server/execution-context', destination: '/docs/getting-started/core-concepts/execution-context', permanent: true },
      { source: '/python/sdk/server', destination: '/docs/getting-started/core-concepts/server-concepts', permanent: true },
      { source: '/python/api-reference/guards', destination: '/python/sdk/guards', permanent: true },
      { source: '/python/guides/dual-transport', destination: '/docs/guides/dual-transport#python-servers', permanent: true },
      { source: '/python/guides/verify-transport', destination: '/docs/guides/verify-transport#check-a-python-server', permanent: true },
      { source: '/python/ai-agents/sdk-reference', destination: '/docs/sdk/sdk-quick-reference', permanent: true },
      { source: '/python/cli/overview', destination: '/docs/cli/overview', permanent: true },
      { source: '/python/cli/installation', destination: '/docs/cli/installation', permanent: true },
      { source: '/python/cli/init', destination: '/docs/cli/init', permanent: true },
      { source: '/python/cli/dev', destination: '/docs/cli/dev', permanent: true },
      { source: '/python/cli/start', destination: '/docs/cli/build-and-ship#start', permanent: true },
      { source: '/python/cli/pack', destination: '/docs/cli/build-and-ship#pack', permanent: true },
      { source: '/python/cli/install', destination: '/docs/cli/manage-dependencies#install', permanent: true },
      { source: '/python/cli/upgrade', destination: '/docs/cli/manage-dependencies#upgrade', permanent: true },
      { source: '/python/cli/generate', destination: '/docs/cli/generate', permanent: true },
      { source: '/python/cli/validate', destination: '/docs/cli/build-and-ship#validate', permanent: true },
      { source: '/python/cli/register', destination: '/docs/cli/dev#register-with-claude-desktop', permanent: true },
      { source: '/python/cli/configuration', destination: '/docs/cli/configuration#python-configuration', permanent: true },
      { source: '/python/cli', destination: '/docs/cli/overview', permanent: true },
      { source: '/python/ai-agents/cli-reference', destination: '/docs/cli/cli-commands', permanent: true },
      { source: '/docs/workflows/overview', destination: '/docs/getting-started/quickstart', permanent: true },
      { source: '/docs/workflows/create-a-project', destination: '/docs/cli/init', permanent: true },
      { source: '/docs/workflows/development-cycle', destination: '/docs/cli/dev', permanent: true },
      { source: '/docs/workflows/add-a-feature-module', destination: '/docs/cli/generate', permanent: true },
      { source: '/docs/workflows/deploy-to-production', destination: '/docs/cli/build-and-ship', permanent: true },
      { source: '/docs/workflows', destination: '/docs/getting-started/quickstart', permanent: true },
      { source: '/python/getting-started/:path*', destination: '/python/sdk/quick-start', permanent: true },
      { source: '/docs/cloud/apps/chat/branding', destination: '/docs/cloud/apps/chat/settings', permanent: true },
      { source: '/docs/cloud/apps/deployments', destination: '/docs/cloud/apps/mcp/deployments', permanent: true },
      { source: '/docs/cloud/apps/logs-and-monitoring', destination: '/docs/cloud/apps/mcp/monitoring', permanent: true },
      { source: '/docs/cloud/apps/domains-and-integrations', destination: '/docs/cloud/apps/mcp/domains', permanent: true },
      { source: '/python/deployment/cloud-platforms', destination: '/python/deployment/cloud', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default withMDX(config);
