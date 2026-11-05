# NitroStack Documentation (`fumadocs`)

The official documentation platform for NitroStack, the Model Context Protocol (MCP) framework for TypeScript and Python. Built with Next.js 16 (Turbopack) and Fumadocs 16.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                     NITROSTACK FUMADOCS ENGINE                         │
├──────────────────────────────────┬─────────────────────────────────────┤
│  TypeScript SDK & CLI            │  Python SDK & CLI                   │
│  Route: /docs                    │  Route: /python                     │
│  Source: content/typescript/     │  Source: content/python/            │
│  Loader: tsSource                │  Loader: pySource                   │
├──────────────────────────────────┴─────────────────────────────────────┤
│  AI Agent Ingestion Pipeline                                           │
│  - /llms.txt                     : Dual-language agent catalog         │
│  - /llms-full.txt                : Aggregated raw markdown             │
│  - Content Negotiation           : Automatic .md proxying via proxy.ts │
├────────────────────────────────────────────────────────────────────────┤
│  Deployment Target: Google Cloud Run (Port 8080) via cloudbuild.yaml   │
└────────────────────────────────────────────────────────────────────────┘
```

## Features

- **Multi-Language Architecture**: Native dual-source architecture serving 135 pages across TypeScript (`/docs`) and Python (`/python`).
- **Brand Tokens & Dark-Mode-Only**: Locked dark theme using official palette (`#0E0F14` Canvas Base, `#2AB5A5` Cool Mint, `#3B82F6` Signal Blue).
- **AI Agent Tooling**:
  - `/llms.txt`: Consolidated, agent-first index listing all documentation routes and skill install directives.
  - `/llms-full.txt`: Full raw markdown stream across all documents.
  - Automatic Content Negotiation: `Accept: text/markdown` headers and `.md` suffixes automatically serve raw markdown via Next.js `proxy.ts`.
  - Client-Side Prompt Helper: `<CopyDocsForLlm />` dropdown in the navigation header.
- **Dynamic SEO & Social Cards**: Automated 1200×630 Open Graph preview image generation (`/og/docs/...` and `/og/python/...`) and dynamic `/sitemap.xml`.
- **Standalone Cloud Run Container**: Lightweight, multi-stage Docker container listening on port 8080 with automated deployment via `cloudbuild.yaml`.

## Directory Structure

```text
.
├── app/
│   ├── (home)/              # Landing page
│   ├── docs/                # TypeScript documentation layout & routes
│   ├── python/              # Python documentation layout & routes
│   ├── api/search/          # Multi-source fast search endpoint
│   ├── llms.txt/            # Agent index endpoint
│   ├── llms-full.txt/       # Aggregated markdown endpoint
│   ├── llms.mdx/            # Raw markdown streaming route handlers
│   ├── og/                  # Dynamic Open Graph card generation
│   ├── sitemap.ts           # Dynamic XML sitemap
│   └── global.css           # Tailwind v4 theme definitions
├── components/              # Brand components (CTA, Skills button, LLM copy)
├── content/
│   ├── typescript/          # 75 TypeScript documentation MDX pages
│   └── python/              # 60 Python documentation MDX pages
├── lib/
│   ├── source.ts            # Fumadocs dual loaders (tsSource & pySource)
│   ├── language.ts          # Bidirectional language mapping & helpers
│   └── shared.ts            # Global metadata and route constants
├── public/                  # Static SVG diagrams, demo GIFs, and badges
├── cloudbuild.yaml          # Google Cloud Build pipeline configuration
├── Dockerfile               # Multi-stage production container
└── proxy.ts                 # Next.js 16 content negotiation proxy
```

## Development & Testing

### Prerequisites

- Node.js 20+
- npm 10+

### Local Development

```bash
# Install dependencies
npm install

# Run development server with hot-reload
npm run dev

# Verify TypeScript types and collection generation
npm run types:check

# Create optimized production build
npm run build
```

### Production Runner

```bash
# Build standalone distribution
npm run build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

# Run standalone server on port 8080
PORT=8080 HOSTNAME="0.0.0.0" node .next/standalone/server.js
```

## Deployment

The application is deployed on Google Cloud Run via Google Cloud Build. Every commit to `main` triggers `cloudbuild.yaml` to build the standalone Docker image and deploy to Cloud Run service `nitrodocs`.
