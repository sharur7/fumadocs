import type { ReactNode } from 'react';

type Pkg = { name: string; version: string; lang: 'ts' | 'py' };

/** Wraps the release feed. */
export function Changelog({ children }: { children: ReactNode }) {
  return <div className="nx-changelog">{children}</div>;
}

/**
 * One release in the feed: date and package versions in the left rail,
 * the notes on the right. Put the release title as the first `##` heading
 * inside, so it shows in "On this page".
 */
export function Release({ date, packages, children }: { date: string; packages: Pkg[]; children: ReactNode }) {
  return (
    <section className="nx-release">
      <div className="nx-release-rail">
        <time className="nx-release-date">{date}</time>
        <div className="nx-release-pkgs">
          {packages.map((p) => (
            <span key={`${p.name}@${p.version}`} className={`nx-release-pkg nx-release-pkg-${p.lang}`}>
              <span className="nx-release-pkg-name">{p.name}</span>
              <span className="nx-release-pkg-ver">{p.version}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="nx-release-body">{children}</div>
    </section>
  );
}
