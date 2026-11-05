import * as React from 'react';
import type { ReactNode } from 'react';
import { Logo } from '../Logo/Logo';

export interface AuthLayoutProps {
  eyebrow?: string;
  headline?: string;
  supportingCopy?: string;
  footnote?: string;
  version?: string;
  children?: ReactNode;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const TORN_EDGE =
  'polygon(0 0, 60% 0, 100% 2%, 38% 4%, 78% 6%, 30% 9%, 92% 12%, 45% 15%, 70% 18%, 25% 21%, 88% 25%, 40% 28%, 75% 31%, 32% 35%, 95% 38%, 50% 42%, 72% 45%, 28% 49%, 85% 52%, 42% 56%, 78% 59%, 30% 63%, 90% 66%, 48% 70%, 70% 73%, 26% 77%, 88% 80%, 44% 84%, 76% 87%, 34% 91%, 82% 94%, 40% 97%, 65% 100%, 0 100%)';

export const AuthLayout = ({
  eyebrow,
  headline = 'Sign in to keep building what the world needs next.',
  supportingCopy = 'MassChallenge backs the rare humans with the grit to solve the toughest challenges. Pick up where you left off.',
  footnote = 'Since 2009 · Global network',
  version,
  children,
  className,
}: AuthLayoutProps) => (
  <div
    data-propellant
    className={joinClasses(
      'propellant-auth relative flex min-h-screen overflow-x-hidden bg-[var(--bg-grouped)] text-[var(--label)]',
      className,
    )}
  >
    <aside className="propellant-auth-brand relative box-border flex max-[880px]:hidden w-[44%] min-w-[380px] max-w-[560px] flex-col justify-between gap-10 px-12 py-10 bg-[var(--brand-surface)] text-[var(--on-brand-surface)]">
      <Logo treatment="white" className="self-start" />
      <div className="flex max-w-[400px] flex-col gap-4">
        {eyebrow ? (
          <span className="text-footnote font-semibold text-[var(--brand-accent)]">{eyebrow}</span>
        ) : null}
        <h1 className="m-0 text-display font-bold uppercase tracking-normal [font-family:var(--type-family-brand)] text-pretty">
          {headline}
        </h1>
        <p className="m-0 text-body opacity-90 text-pretty">{supportingCopy}</p>
      </div>
      <p className="m-0 text-footnote opacity-80">{footnote}</p>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-[-23px] w-6 bg-[var(--brand-surface)]"
        style={{ clipPath: TORN_EDGE }}
      />
    </aside>
    <main className="box-border flex flex-1 items-center justify-center px-6 py-8">
      <div className="w-full max-w-90">{children}</div>
    </main>
    {version ? (
      <span className="pointer-events-none fixed bottom-4 right-6 text-footnote tabular-nums text-[var(--label-tertiary)]">
        {version}
      </span>
    ) : null}
  </div>
);
