import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { getDocsTabs, getDocsTree } from '@/lib/navigation';
import { SidebarFooter } from '@/components/sidebar-footer';
import { SidebarSeparator } from '@/components/sidebar-separator';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const tree = getDocsTree();
  const base = baseOptions({ showLlmButton: false });
  return (
    <DocsLayout tree={tree} {...base} tabMode="navbar" tabs={getDocsTabs(tree)} sidebar={{ components: { Separator: SidebarSeparator }, footer: <SidebarFooter /> }}>
      {children}
    </DocsLayout>
  );
}
