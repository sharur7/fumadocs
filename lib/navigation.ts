import type { Folder, Node, Root } from 'fumadocs-core/page-tree';
import { createElement } from 'react';
import { Code } from 'lucide-react';
import { pySource, tsSource } from '@/lib/source';

/**
 * One sidebar for the whole site.
 *
 * The TypeScript tree (content/typescript) is the base. Python pages keep
 * their own source and URLs (/python/...), so search and the LLM routes are
 * unchanged; only the navigation is merged:
 *
 *   Documentation > NitroStack SDK > Python  ← Python SDK and deployment
 *
 * Python templates and API reference are merged into the Examples and
 * Reference pages as TypeScript/Python tabs, so they are not listed here.
 */

function firstUrl(nodes: Node[]): string | undefined {
  for (const node of nodes) {
    if (node.type === 'page') return node.url;
    if (node.type === 'folder') {
      const url = node.index?.url ?? firstUrl(node.children);
      if (url) return url;
    }
  }
  return undefined;
}

/** Find a top-level Python folder by the URL prefix of its pages, e.g. "/python/sdk/". */
function pyFolder(tree: Root, prefix: string): Folder | undefined {
  return tree.children.find(
    (node): node is Folder => node.type === 'folder' && (firstUrl([node]) ?? '').startsWith(prefix),
  );
}

function withChildren(folder: Folder, children: Node[]): Folder {
  return { ...folder, children };
}

function withoutChecklist(folder: Folder | undefined): Folder | undefined {
  if (!folder) return folder;
  return { ...folder, children: folder.children.filter((n) => !(n.type === 'page' && n.url.endsWith('/deployment/checklist'))) };
}

function rename(folder: Folder | undefined, name: string, id: string): Folder[] {
  return folder ? [{ ...folder, name, $id: id, defaultOpen: false }] : [];
}

function buildDocsTree(): Root {
  const ts = tsSource.getPageTree();
  const py = pySource.getPageTree();

  const pySdk = pyFolder(py, '/python/sdk/');

  const pythonSection: Folder = {
    type: 'folder',
    $id: 'nx-python-sdk',
    name: 'Python',
    icon: createElement(Code),
    defaultOpen: false,
    children: [
      ...(pySdk?.children ?? []),
      ...rename(withoutChecklist(pyFolder(py, '/python/deployment/')), 'Deployment', 'nx-python-deployment'),
    ],
  };

  const isSdk = (node: Node) => node.type === 'folder' && (firstUrl([node]) ?? '').startsWith('/docs/sdk/');
  const rootNamed = (node: Node, name: string): Folder | undefined =>
    node.type === 'folder' && node.root && node.name === name ? node : undefined;

  // Python goes right after the TypeScript folder, under the "NitroStack SDK" heading.
  const children = ts.children.map((node): Node => {
    const docs = rootNamed(node, 'Documentation');
    if (!docs) return node;
    const items = docs.children.flatMap((child): Node[] => (isSdk(child) ? [child, pythonSection] : [child]));
    return withChildren(docs, items);
  });

  return { ...ts, children };
}

let cached: Root | undefined;

/** The merged sidebar tree used by both the /docs and /python layouts. */
export function getDocsTree(): Root {
  if (process.env.NODE_ENV === 'development' || !cached) cached = buildDocsTree();
  return cached;
}

/** Top-bar tabs (Documentation | Examples | Reference) built from the root folders. */
export function getDocsTabs(tree: Root = getDocsTree()) {
  return tree.children
    .filter((node): node is Folder => node.type === 'folder' && Boolean(node.root))
    .flatMap((folder) => {
      const url = folder.index?.url ?? firstUrl(folder.children);
      return url ? [{ title: folder.name, url, $folder: folder }] : [];
    });
}
