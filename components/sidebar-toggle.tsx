'use client';

import { SidebarCollapseTrigger } from 'fumadocs-ui/layouts/notebook/slots/sidebar';
import { PanelLeft } from 'lucide-react';

/** Collapses and expands the left sidebar. Sits at the left of the top bar, next to the panel it controls. */
export function SidebarToggle() {
  return (
    <SidebarCollapseTrigger className="nx-sb-toggle" aria-label="Toggle sidebar" title="Toggle sidebar">
      <PanelLeft />
    </SidebarCollapseTrigger>
  );
}
