import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { CloudCTA } from '@/components/cloud-cta';
import { InstallSkillsButton } from '@/components/install-skills-button';
import { Illustration } from '@/components/illustrations';
import { ArchitectureDiagram, DevServerDiagram, DualTransportDiagram, PipelineDiagram, RequestFlowDiagram, StudioMapDiagram, TransportsDiagram, VerifyTransportDiagram } from '@/components/diagrams';
import { Screenshot } from '@/components/screenshot';
import { SupportChannels } from '@/components/support-channels';
import { YouTube } from '@/components/youtube';
import { Changelog, Release } from '@/components/changelog';
import { Compare, Flow, Fork, Layers, Phases, Sequence } from '@/components/diagram-kit';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    CloudCTA,
    InstallSkillsButton,
    Illustration,
    RequestFlowDiagram,
    PipelineDiagram,
    ArchitectureDiagram,
    TransportsDiagram,
    DualTransportDiagram,
    VerifyTransportDiagram,
    StudioMapDiagram,
    DevServerDiagram,
    Screenshot,
    SupportChannels,
    YouTube,
    Changelog,
    Release,
    Flow,
    Phases,
    Sequence,
    Compare,
    Fork,
    Layers,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

