import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { getDocsTabs, getDocsTree } from '@/lib/navigation';
import { SidebarFooter } from '@/components/sidebar-footer';
import { SidebarToggle } from '@/components/sidebar-toggle';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const tree = getDocsTree();
  const base = baseOptions({ showLlmButton: false });
  return (
    <DocsLayout tree={tree} {...base} nav={{ ...base.nav, children: <SidebarToggle /> }} tabMode="navbar" tabs={getDocsTabs(tree)} sidebar={{ footer: <SidebarFooter /> }}>
      {children}
    </DocsLayout>
  );
}
