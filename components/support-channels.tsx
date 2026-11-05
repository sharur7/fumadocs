import type { ReactNode } from 'react';
import { ArrowUpRight, Cloud, History, LifeBuoy } from 'lucide-react';

function Discord() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function GitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

type Channel = {
  icon: ReactNode;
  tone: string;
  title: string;
  when: string;
  href: string;
  cta: string;
};

const channels: Channel[] = [
  {
    icon: <LifeBuoy />,
    tone: 'blue',
    title: 'Troubleshooting',
    when: 'Something fails and you want the known fix.',
    href: '/docs/troubleshooting',
    cta: 'Find your symptom',
  },
  {
    icon: <Discord />,
    tone: 'discord',
    title: 'Discord',
    when: 'Questions, ideas, and help from the community and the team.',
    href: 'https://discord.com/invite/vb5n9rjtBR',
    cta: 'Join the server',
  },
  {
    icon: <GitHub />,
    tone: 'ink',
    title: 'GitHub issues',
    when: 'A bug in the SDK or CLI that you can reproduce.',
    href: '#report-a-bug',
    cta: 'Choose a repository',
  },
  {
    icon: <Cloud />,
    tone: 'blue',
    title: 'NitroCloud support',
    when: 'Your account, apps, deployments, or billing.',
    href: '#nitrocloud-account-and-billing',
    cta: 'Contact the team',
  },
  {
    icon: <History />,
    tone: 'indigo',
    title: 'Changelog',
    when: 'Check whether a fix has shipped in a newer release.',
    href: '/docs/changelog',
    cta: 'See releases',
  },
  {
    icon: <XLogo />,
    tone: 'ink',
    title: 'X',
    when: 'Product news and release announcements.',
    href: 'https://x.com/nitrostackai',
    cta: 'Follow @nitrostackai',
  },
];

/** The ways to get help, as a grid of glass tiles. */
export function SupportChannels() {
  return (
    <div className="nx-support not-prose">
      {channels.map((c) => {
        const external = c.href.startsWith('http');
        return (
          <a
            key={c.title}
            href={c.href}
            className="nx-support-tile"
            {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
          >
            <span className={`nx-support-logo nx-support-logo-${c.tone}`}>{c.icon}</span>
            <span className="nx-support-title">{c.title}</span>
            <span className="nx-support-when">{c.when}</span>
            <span className="nx-support-cta">
              {c.cta}
              <ArrowUpRight aria-hidden />
            </span>
          </a>
        );
      })}
    </div>
  );
}
