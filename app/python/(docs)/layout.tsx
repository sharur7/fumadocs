import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { getDocsTabs, getDocsTree } from '@/lib/navigation';
import { SidebarFooter } from '@/components/sidebar-footer';
import { SidebarSeparator } from '@/components/sidebar-separator';

// Python pages share the site-wide navigation: they live under
// Documentation > NitroStack SDK > Python (see lib/navigation.ts).
export default function Layout({ children }: { children: React.ReactNode }) {
  const tree = getDocsTree();
  const base = baseOptions({ showLlmButton: false });
  return (
    <DocsLayout tree={tree} {...base} tabMode="navbar" tabs={getDocsTabs(tree)} sidebar={{ components: { Separator: SidebarSeparator }, footer: <SidebarFooter /> }}>
      {children}
    </DocsLayout>
  );
}
