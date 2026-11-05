import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { getDocsTabs, getDocsTree } from '@/lib/navigation';
import { SidebarFooter } from '@/components/sidebar-footer';
import { SidebarToggle } from '@/components/sidebar-toggle';

// Python pages share the site-wide navigation: they live under
// Documentation > NitroStack SDK > Python (see lib/navigation.ts).
export default function Layout({ children }: { children: React.ReactNode }) {
  const tree = getDocsTree();
  const base = baseOptions({ showLlmButton: false });
  return (
    <DocsLayout tree={tree} {...base} nav={{ ...base.nav, children: <SidebarToggle /> }} tabMode="navbar" tabs={getDocsTabs(tree)} sidebar={{ footer: <SidebarFooter /> }}>
      {children}
    </DocsLayout>
  );
}
