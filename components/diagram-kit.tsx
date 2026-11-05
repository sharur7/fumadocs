/**
 * Data-driven diagrams for MDX pages, in the same visual language as
 * components/diagrams.tsx: soft panel, white nodes, thin connectors,
 * brand-blue accents. Every diagram stacks vertically in narrow containers.
 *
 * Usage in MDX (icons are lucide names, as strings):
 *   <Flow steps={[{ title: 'Guards', icon: 'ShieldCheck' }, { title: 'Handler' }]} />
 *   <Phases phases={[{ label: 'Startup', steps: [{ title: 'create()', sub: '...' }] }]} />
 *   <Sequence actors={['Client', 'Server']} messages={[{ from: 0, to: 1, label: 'tools/call' }]} />
 *   <Compare columns={[{ title: 'Before', items: ['...'] }, { title: 'After', accent: true, items: ['...'] }]} />
 *   <Fork start={[{ title: 'Result' }]} branches={[{ label: 'small', steps: [{ title: 'Return' }] }]} />
 *   <Layers layers={[{ title: 'Host' }, { title: 'Worker' }]} items={['...']} />
 */
import type { ReactNode } from 'react';
import * as Icons from 'lucide-react';

type IconName = keyof typeof Icons;

export interface DiagramStep {
  title: string;
  sub?: string;
  icon?: string;
  tone?: 'blue' | 'indigo' | 'muted';
}

function Icon({ name }: { name?: string }) {
  if (!name) return null;
  const C = Icons[name as IconName] as unknown as React.ComponentType<{ className?: string }> | undefined;
  return C ? <C /> : null;
}

function Node({ step, index, stacked = false }: { step: DiagramStep; index?: number; stacked?: boolean }) {
  return (
    <div className={`nxk-node ${stacked ? 'nxk-node-stacked' : ''} ${step.tone === 'muted' ? 'nxk-node-muted' : ''}`}>
      {step.icon ? (
        <span className={`nxd-tile nxd-tile-${step.tone === 'indigo' ? 'indigo' : 'blue'}`}>
          <Icon name={step.icon} />
        </span>
      ) : index !== undefined ? (
        <span className="nxk-num">{index + 1}</span>
      ) : null}
      <span className="nxk-text">
        <span className="nxk-title">{step.title}</span>
        {step.sub ? <span className="nxk-sub">{step.sub}</span> : null}
      </span>
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="nxk-arrow" aria-hidden="true">
      <span className="nxk-line" />
      {label ? <span className="nxk-pill">{label}</span> : null}
    </div>
  );
}

function Frame({ children, caption, className = '' }: { children: ReactNode; caption?: string; className?: string }) {
  return (
    <figure className={`nxd nxk not-prose ${className}`}>
      {children}
      {caption ? <figcaption className="nxd-caption">{caption}</figcaption> : null}
    </figure>
  );
}

/** A left-to-right chain of steps (top-to-bottom when narrow). */
export function Flow({
  steps,
  labels = [],
  caption,
  numbered = false,
  stacked = true,
}: {
  steps: DiagramStep[];
  labels?: string[];
  caption?: string;
  numbered?: boolean;
  stacked?: boolean;
}) {
  return (
    <Frame caption={caption}>
      <div className="nxk-flow">
        {steps.map((s, i) => (
          <FlowItem key={i} step={s} index={numbered ? i : undefined} last={i === steps.length - 1} label={labels[i]} stacked={stacked} />
        ))}
      </div>
    </Frame>
  );
}

function FlowItem({ step, index, last, label, stacked }: { step: DiagramStep; index?: number; last: boolean; label?: string; stacked: boolean }) {
  return (
    <>
      <Node step={step} index={index} stacked={stacked} />
      {last ? null : <Arrow label={label} />}
    </>
  );
}

/** Ordered phases, each a numbered row of steps (lifecycles, multi-stage processes). */
export function Phases({
  phases,
  caption,
}: {
  phases: { label: string; note?: string; steps: DiagramStep[] }[];
  caption?: string;
}) {
  let n = 0;
  return (
    <Frame caption={caption}>
      {phases.map((phase, p) => (
        <div key={p} className="nxk-phase">
          <div className="nxk-phase-head">
            <span className="nxk-phase-label">{phase.label}</span>
            {phase.note ? <span className="nxk-phase-note">{phase.note}</span> : null}
          </div>
          <div className="nxk-flow nxk-flow-grid" style={{ ['--nxk-cols' as string]: phase.steps.length }}>
            {phase.steps.map((s, i) => {
              const idx = n++;
              return <FlowItem key={i} step={s} index={idx} last={i === phase.steps.length - 1} stacked />;
            })}
          </div>
        </div>
      ))}
    </Frame>
  );
}

/** A message sequence between two or three actors. */
export function Sequence({
  actors,
  messages,
  caption,
}: {
  actors: string[];
  messages: ({ from: number; to: number; label: string; sub?: string } | { at: number; note: string })[];
  caption?: string;
}) {
  const cols = actors.length;
  let step = 0;
  return (
    <Frame caption={caption} className="nxk-seq-frame">
      <div className="nxk-seq" style={{ ['--nxk-cols' as string]: cols }}>
        {actors.map((a, i) => (
          <div key={a} className="nxk-actor" style={{ gridColumn: i + 1 }}>
            {a}
          </div>
        ))}
        {actors.map((a, i) => (
          <div key={`life-${a}`} className="nxk-life" style={{ gridColumn: i + 1, gridRow: `2 / span ${messages.length}` }} aria-hidden="true" />
        ))}
        {messages.map((m, r) => {
          const row = r + 2;
          if ('note' in m) {
            return (
              <div key={r} className="nxk-note" style={{ gridColumn: m.at + 1, gridRow: row }}>
                {m.note}
              </div>
            );
          }
          step += 1;
          const lo = Math.min(m.from, m.to);
          const hi = Math.max(m.from, m.to);
          const back = m.to < m.from;
          return (
            <div
              key={r}
              className={`nxk-msg ${back ? 'nxk-msg-back' : ''}`}
              style={{ gridColumn: `${lo + 1} / ${hi + 2}`, gridRow: row, ['--k' as string]: hi - lo + 1 }}
            >
              <span className="nxk-msg-label">
                <span className="nxk-msg-n">{step}</span>
                {m.label}
                {m.sub ? <span className="nxk-msg-sub">{m.sub}</span> : null}
              </span>
              <span className="nxk-msg-line" aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

/** Two or three side-by-side columns, for before/after or "this vs that". */
export function Compare({
  columns,
  caption,
}: {
  columns: { title: string; sub?: string; icon?: string; accent?: boolean; items: string[] }[];
  caption?: string;
}) {
  return (
    <Frame caption={caption}>
      <div className="nxk-compare" style={{ ['--nxk-cols' as string]: columns.length }}>
        {columns.map((c, i) => (
          <div key={i} className={`nxk-col ${c.accent ? 'nxk-col-accent' : ''}`}>
            <div className="nxk-col-head">
              {c.icon ? (
                <span className={`nxd-tile nxd-tile-${c.accent ? 'blue' : 'indigo'}`}>
                  <Icon name={c.icon} />
                </span>
              ) : null}
              <span className="nxk-text">
                <span className="nxk-title">{c.title}</span>
                {c.sub ? <span className="nxk-sub">{c.sub}</span> : null}
              </span>
            </div>
            <ul className="nxk-items">
              {c.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/** A chain of steps that splits into two or more outcomes. */
export function Fork({
  start,
  branches,
  caption,
}: {
  start: DiagramStep[];
  branches: { label: string; steps: DiagramStep[]; accent?: boolean }[];
  caption?: string;
}) {
  return (
    <Frame caption={caption}>
      <div className="nxk-flow">
        {start.map((s, i) => (
          <FlowItem key={i} step={s} last={i === start.length - 1} stacked />
        ))}
      </div>
      <div className="nxk-fork-stem" aria-hidden="true">
        <span className="nxk-line" />
      </div>
      <div className="nxk-branches" style={{ ['--nxk-cols' as string]: branches.length }}>
        {branches.map((b, i) => (
          <div key={i} className={`nxk-branch ${b.accent ? 'nxk-branch-accent' : ''}`}>
            <span className="nxk-pill nxk-branch-label">{b.label}</span>
            <div className="nxk-branch-steps">
              {b.steps.map((s, j) => (
                <div key={j} className="nxk-branch-step">
                  <Node step={s} />
                  {j < b.steps.length - 1 ? <span className="nxk-vgap" aria-hidden="true" /> : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/** Nested containers, outermost first; the innermost one can list facts. */
export function Layers({
  layers,
  items = [],
  caption,
}: {
  layers: { title: string; sub?: string }[];
  items?: string[];
  caption?: string;
}) {
  const render = (i: number): ReactNode => {
    const l = layers[i];
    const inner = i === layers.length - 1;
    return (
      <div className={`nxk-layer nxk-layer-${Math.min(i, 3)}`}>
        <div className="nxk-layer-head">
          <span className="nxk-title">{l.title}</span>
          {l.sub ? <span className="nxk-sub">{l.sub}</span> : null}
        </div>
        {inner ? (
          items.length ? (
            <ul className="nxk-items nxk-items-grid">
              {items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          ) : null
        ) : (
          render(i + 1)
        )}
      </div>
    );
  };
  return <Frame caption={caption}>{render(0)}</Frame>;
}
