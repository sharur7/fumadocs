'use client';

import type { Separator } from 'fumadocs-core/page-tree';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import { SidebarToggle } from './sidebar-toggle';

/**
 * Sidebar section heading (Getting Started, NitroStack SDK, ...).
 * The first heading also carries the collapse button at its right edge, so the
 * button lives inside the scrolling list and moves with it instead of floating
 * over the folder arrows.
 */
export function SidebarSeparator({ item }: { item: Separator }) {
  const { root } = useTreeContext();
  const first = root.children[0] === item;

  return (
    <p
      className="inline-flex w-full items-center justify-between gap-2 mb-1.5 px-2 mt-6 empty:mb-0 first:mt-0 [&_svg]:size-4 [&_svg]:shrink-0"
      style={{ paddingInlineStart: 'calc(2 * var(--spacing))' }}
    >
      <span className="inline-flex items-center gap-2">
        {item.icon}
        {item.name}
      </span>
      {first ? <SidebarToggle /> : null}
    </p>
  );
}
