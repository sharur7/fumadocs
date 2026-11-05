import type { ReactNode } from 'react';
/**
 * Small flat illustrations for cards, in the NitroStack blue palette.
 * Colors come from CSS variables (see app/global.css, "Illustrations"),
 * so every illustration follows light and dark mode.
 *
 * Usage in MDX:
 *   <Card className="nx-card-illo" icon={<Illustration name="rocket" />} ... />
 */

const BLUE = 'var(--illo-blue)';
const SOFT = 'var(--illo-blue-soft)';
const UI = 'var(--illo-ui)';
const LINE = 'var(--illo-ui-line)';
const INK = 'var(--illo-ink)';
const MUTED = 'var(--illo-muted)';

function Window({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={UI} stroke={LINE} strokeWidth={2} />
      <line x1={x} y1={y + 12} x2={x + w} y2={y + 12} stroke={LINE} strokeWidth={2} />
      <circle cx={x + 7} cy={y + 6} r={1.8} fill={MUTED} />
      <circle cx={x + 13} cy={y + 6} r={1.8} fill={MUTED} />
      <circle cx={x + 19} cy={y + 6} r={1.8} fill={MUTED} />
    </g>
  );
}

function Lines({ x, y, widths }: { x: number; y: number; widths: number[] }) {
  return (
    <g>
      {widths.map((w, i) => (
        <rect key={i} x={x} y={y + i * 8} width={w} height={3.5} rx={1.75} fill={LINE} />
      ))}
    </g>
  );
}

function Ground() {
  return <line x1={30} y1={108} x2={170} y2={108} stroke={INK} strokeWidth={1.5} strokeLinecap="round" opacity={0.6} />;
}

const scenes: Record<string, ReactNode> = {
  rocket: (
    <g>
      <Window x={22} y={22} w={96} h={70} />
      <Lines x={32} y={44} widths={[52, 40, 60, 34]} />
      <g transform="translate(128 22) rotate(35)">
        <path d="M14 0 C24 10 26 30 22 46 L6 46 C2 30 4 10 14 0 Z" fill={BLUE} />
        <circle cx={14} cy={20} r={5} fill={UI} stroke={INK} strokeWidth={1.5} />
        <path d="M6 34 L-2 46 L6 46 Z M22 34 L30 46 L22 46 Z" fill={INK} />
        <path d="M9 48 L14 64 L19 48 Z" fill={SOFT} />
      </g>
      <Ground />
    </g>
  ),
  book: (
    <g>
      <path d="M40 34 Q70 24 100 36 L100 96 Q70 84 40 94 Z" fill={UI} stroke={LINE} strokeWidth={2} />
      <path d="M160 34 Q130 24 100 36 L100 96 Q130 84 160 94 Z" fill={UI} stroke={LINE} strokeWidth={2} />
      <Lines x={50} y={46} widths={[38, 30, 36, 24]} />
      <line x1={118} y1={50} x2={142} y2={66} stroke={BLUE} strokeWidth={2} />
      <line x1={118} y1={70} x2={142} y2={66} stroke={BLUE} strokeWidth={2} />
      <circle cx={118} cy={50} r={5} fill={BLUE} />
      <circle cx={118} cy={70} r={5} fill={SOFT} />
      <circle cx={142} cy={66} r={6} fill={INK} />
      <Ground />
    </g>
  ),
  flow: (
    <g>
      {[22, 80, 138].map((x, i) => (
        <g key={x}>
          <rect x={x} y={44} width={40} height={30} rx={6} fill={i === 1 ? BLUE : UI} stroke={i === 1 ? BLUE : LINE} strokeWidth={2} />
          <rect x={x + 8} y={54} width={24} height={3.5} rx={1.75} fill={i === 1 ? UI : LINE} />
          <rect x={x + 8} y={62} width={16} height={3.5} rx={1.75} fill={i === 1 ? UI : LINE} />
        </g>
      ))}
      <path d="M64 59 H76 M71 54 L77 59 L71 64 M122 59 H134 M129 54 L135 59 L129 64" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
      <circle cx={100} cy={30} r={8} fill={SOFT} />
      <path d="M100 22 V38 M92 30 H108" stroke={UI} strokeWidth={2} />
      <Ground />
    </g>
  ),
  shield: (
    <g>
      <Window x={58} y={18} w={112} h={76} />
      <circle cx={88} cy={52} r={11} fill={LINE} />
      <Lines x={108} y={42} widths={[46, 36, 50, 30]} />
      <path d="M52 40 C52 28 74 28 74 40 V50" stroke={INK} strokeWidth={4} fill="none" />
      <rect x={42} y={50} width={42} height={36} rx={7} fill={BLUE} />
      <circle cx={63} cy={64} r={4.5} fill={UI} />
      <rect x={61} y={66} width={4} height={10} rx={2} fill={UI} />
      <Ground />
    </g>
  ),
  route: (
    <g>
      <path d="M30 88 C70 88 60 40 100 40 S140 70 170 30" stroke={LINE} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M30 88 C70 88 60 40 100 40 S140 70 170 30" stroke={BLUE} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeDasharray="6 7" />
      <circle cx={30} cy={88} r={7} fill={INK} />
      <circle cx={100} cy={40} r={7} fill={SOFT} />
      <path d="M160 22 L172 30 L160 38" stroke={BLUE} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={84} y={70} width={44} height={24} rx={5} fill={UI} stroke={LINE} strokeWidth={2} />
      <rect x={92} y={78} width={28} height={3.5} rx={1.75} fill={BLUE} />
      <rect x={92} y={85} width={18} height={3.5} rx={1.75} fill={LINE} />
    </g>
  ),
  sparkle: (
    <g>
      <rect x={24} y={42} width={44} height={40} rx={7} fill={UI} stroke={LINE} strokeWidth={2} />
      <Lines x={32} y={52} widths={[28, 20, 24]} />
      <rect x={132} y={36} width={44} height={52} rx={7} fill={BLUE} />
      <rect x={140} y={46} width={28} height={3.5} rx={1.75} fill={UI} />
      <rect x={140} y={54} width={20} height={3.5} rx={1.75} fill={UI} />
      <rect x={140} y={62} width={24} height={3.5} rx={1.75} fill={UI} />
      <rect x={140} y={70} width={14} height={3.5} rx={1.75} fill={SOFT} />
      <path d="M76 62 H122 M116 56 L123 62 L116 68" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M100 30 L103 39 L112 42 L103 45 L100 54 L97 45 L88 42 L97 39 Z" fill={SOFT} />
      <Ground />
    </g>
  ),
  funnel: (
    <g>
      <circle cx={70} cy={22} r={5} fill={SOFT} />
      <circle cx={92} cy={16} r={5} fill={BLUE} />
      <circle cx={114} cy={22} r={5} fill={LINE} />
      <circle cx={132} cy={14} r={5} fill={SOFT} />
      <path d="M52 32 H148 L112 68 V92 L88 100 V68 Z" fill={UI} stroke={LINE} strokeWidth={2} strokeLinejoin="round" />
      <path d="M64 40 H136 L108 66 H92 Z" fill={BLUE} opacity={0.9} />
      <circle cx={100} cy={112} r={5} fill={BLUE} />
    </g>
  ),
  alert: (
    <g>
      <Window x={30} y={18} w={140} h={80} />
      <path d="M100 38 L124 80 H76 Z" fill={BLUE} strokeLinejoin="round" />
      <rect x={98} y={52} width={4} height={14} rx={2} fill={UI} />
      <circle cx={100} cy={72} r={2.5} fill={UI} />
      <Lines x={40} y={40} widths={[26, 18, 22]} />
      <Lines x={134} y={40} widths={[24, 16, 20]} />
    </g>
  ),
  pulse: (
    <g>
      <Window x={26} y={18} w={148} h={84} />
      <path d="M38 80 L62 80 L72 54 L86 92 L100 44 L112 72 L124 64 L162 64" stroke={BLUE} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={100} cy={44} r={4} fill={INK} />
      <rect x={38} y={38} width={34} height={3.5} rx={1.75} fill={LINE} />
    </g>
  ),
  layers: (
    <g>
      <path d="M100 30 L160 52 L100 74 L40 52 Z" fill={BLUE} />
      <path d="M40 66 L100 88 L160 66" stroke={SOFT} strokeWidth={6} fill="none" strokeLinejoin="round" />
      <path d="M40 80 L100 102 L160 80" stroke={LINE} strokeWidth={6} fill="none" strokeLinejoin="round" />
      <circle cx={100} cy={52} r={6} fill={UI} />
    </g>
  ),
  plug: (
    <g>
      <rect x={24} y={40} width={50} height={44} rx={8} fill={UI} stroke={LINE} strokeWidth={2} />
      <Lines x={33} y={52} widths={[30, 22, 26]} />
      <rect x={126} y={40} width={50} height={44} rx={8} fill={BLUE} />
      <rect x={135} y={52} width={30} height={3.5} rx={1.75} fill={UI} />
      <rect x={135} y={60} width={20} height={3.5} rx={1.75} fill={SOFT} />
      <path d="M74 62 H92" stroke={INK} strokeWidth={3} />
      <rect x={92} y={52} width={14} height={20} rx={3} fill={INK} />
      <path d="M106 56 H116 M106 68 H116" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <path d="M116 62 H126" stroke={BLUE} strokeWidth={3} strokeDasharray="3 3" />
      <Ground />
    </g>
  ),
  widget: (
    <g>
      <Window x={30} y={16} w={140} h={88} />
      <rect x={40} y={38} width={56} height={54} rx={5} fill={SOFT} opacity={0.45} />
      <rect x={48} y={70} width={8} height={14} rx={2} fill={BLUE} />
      <rect x={60} y={60} width={8} height={24} rx={2} fill={BLUE} />
      <rect x={72} y={50} width={8} height={34} rx={2} fill={INK} />
      <rect x={104} y={38} width={56} height={24} rx={5} fill={UI} stroke={LINE} strokeWidth={2} />
      <rect x={110} y={46} width={30} height={3.5} rx={1.75} fill={BLUE} />
      <rect x={104} y={68} width={56} height={24} rx={5} fill={UI} stroke={LINE} strokeWidth={2} />
      <rect x={110} y={76} width={22} height={3.5} rx={1.75} fill={LINE} />
    </g>
  ),
  transport: (
    <g>
      <rect x={22} y={36} width={52} height={36} rx={4} fill={UI} stroke={LINE} strokeWidth={2} />
      <rect x={14} y={72} width={68} height={6} rx={3} fill={INK} />
      <Lines x={30} y={46} widths={[30, 22, 26]} />
      <rect x={136} y={28} width={42} height={64} rx={6} fill={BLUE} />
      <rect x={144} y={38} width={26} height={6} rx={2} fill={UI} />
      <rect x={144} y={50} width={26} height={6} rx={2} fill={SOFT} />
      <rect x={144} y={62} width={26} height={6} rx={2} fill={UI} />
      <path d="M88 48 H126 M120 42 L127 48 L120 54" stroke={BLUE} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M126 68 H88 M94 62 L87 68 L94 74" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <Ground />
    </g>
  ),
  folder: (
    <g>
      <path d="M40 38 H80 L90 48 H160 V98 H40 Z" fill={SOFT} opacity={0.55} />
      <rect x={56} y={26} width={40} height={50} rx={4} fill={UI} stroke={LINE} strokeWidth={2} />
      <Lines x={63} y={36} widths={[24, 18, 22]} />
      <rect x={104} y={22} width={40} height={50} rx={4} fill={UI} stroke={LINE} strokeWidth={2} />
      <rect x={111} y={32} width={24} height={3.5} rx={1.75} fill={BLUE} />
      <Lines x={111} y={40} widths={[18, 22]} />
      <path d="M36 56 H164 L156 100 H44 Z" fill={BLUE} />
    </g>
  ),
  terminal: (
    <g>
      <rect x={26} y={18} width={148} height={86} rx={8} fill={INK} />
      <circle cx={36} cy={28} r={2.2} fill={MUTED} />
      <circle cx={44} cy={28} r={2.2} fill={MUTED} />
      <circle cx={52} cy={28} r={2.2} fill={MUTED} />
      <path d="M40 50 L50 58 L40 66" stroke={BLUE} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={58} y={55} width={60} height={5} rx={2.5} fill={SOFT} />
      <rect x={40} y={74} width={90} height={5} rx={2.5} fill={MUTED} opacity={0.6} />
      <rect x={40} y={86} width={8} height={10} rx={1} fill={BLUE} />
    </g>
  ),
  cloud: (
    <g>
      <path d="M58 70 C42 70 38 50 54 46 C54 30 78 26 86 38 C96 24 124 28 124 48 C142 46 146 70 128 70 Z" fill={SOFT} opacity={0.6} />
      <rect x={78} y={60} width={44} height={44} rx={6} fill={BLUE} />
      <rect x={86} y={70} width={28} height={5} rx={2} fill={UI} />
      <rect x={86} y={80} width={28} height={5} rx={2} fill={SOFT} />
      <rect x={86} y={90} width={18} height={5} rx={2} fill={UI} />
      <Ground />
    </g>
  ),
  grid: (
    <g>
      {[0, 1, 2].map((c) =>
        [0, 1].map((r) => (
          <rect
            key={`${c}${r}`}
            x={40 + c * 42}
            y={26 + r * 40}
            width={36}
            height={34}
            rx={6}
            fill={(c + r) % 2 === 0 ? UI : BLUE}
            stroke={(c + r) % 2 === 0 ? LINE : BLUE}
            strokeWidth={2}
          />
        )),
      )}
      <rect x={48} y={36} width={20} height={3.5} rx={1.75} fill={LINE} />
      <rect x={132} y={36} width={20} height={3.5} rx={1.75} fill={LINE} />
      <rect x={90} y={76} width={20} height={3.5} rx={1.75} fill={LINE} />
    </g>
  ),
  code: (
    <g>
      <Window x={30} y={18} w={140} h={86} />
      <path d="M70 48 L56 62 L70 76 M130 48 L144 62 L130 76" stroke={BLUE} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M108 44 L92 80" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
    </g>
  ),
  search: (
    <g>
      <Window x={26} y={22} w={120} h={76} />
      <Lines x={36} y={44} widths={[60, 44, 70, 36, 54]} />
      <circle cx={140} cy={64} r={18} fill={UI} stroke={BLUE} strokeWidth={5} />
      <path d="M153 77 L168 92" stroke={INK} strokeWidth={6} strokeLinecap="round" />
    </g>
  ),
};

export type IllustrationName = keyof typeof scenes;

export function Illustration({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 200 120" role="img" aria-hidden="true" className="nx-illo">
      {scenes[name] ?? scenes.book}
    </svg>
  );
}
