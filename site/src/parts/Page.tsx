import type { ReactNode } from 'react';

export const PageHeading = ({ title, lede }: { title: ReactNode; lede?: ReactNode }) => (
  <header className="flex flex-col gap-3 max-w-[var(--width-reading)]">
    <h1 className="m-0 text-large-title text-[var(--label)] [text-wrap:balance]">{title}</h1>
    {lede ? <p className="m-0 text-body text-[var(--label-secondary)]">{lede}</p> : null}
  </header>
);

export const Section = ({
  title,
  children,
  wide = false,
}: {
  title: ReactNode;
  children?: ReactNode;
  wide?: boolean;
}) => (
  <section className="flex flex-col gap-4 min-w-0">
    <h2 className="m-0 text-title2 text-[var(--label)] [text-wrap:balance]">{title}</h2>
    <div className={`flex flex-col gap-4 min-w-0 ${wide ? '' : 'max-w-[var(--width-reading)]'}`}>
      {children}
    </div>
  </section>
);

export const Subsection = ({ title, children }: { title: ReactNode; children?: ReactNode }) => (
  <div className="flex flex-col gap-3 min-w-0">
    <h3 className="m-0 text-headline text-[var(--label)]">{title}</h3>
    {children}
  </div>
);

export const Prose = ({ children }: { children: ReactNode }) => (
  <p className="m-0 text-body text-[var(--label)]">{children}</p>
);

export const Note = ({ children }: { children: ReactNode }) => (
  <p className="m-0 text-callout text-[var(--label-secondary)]">{children}</p>
);

export const Rules = ({ items }: { items: ReactNode[] }) => (
  <ul className="m-0 pl-5 list-disc flex flex-col gap-2 text-body text-[var(--label)] marker:text-[var(--label-tertiary)]">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

export const Code = ({ children }: { children: ReactNode }) => (
  <code className="font-[family-name:var(--type-family-mono)] text-[0.92em] px-1 py-px rounded-[var(--corner-sm)] bg-[var(--fill-tertiary)] text-[var(--label)]">
    {children}
  </code>
);

export const CodeBlock = ({ children, label }: { children: string; label: string }) => (
  <pre
    aria-label={label}
    className="m-0 p-4 overflow-x-auto rounded-[var(--corner-lg)] bg-[var(--bg)] text-footnote font-[family-name:var(--type-family-mono)] text-[var(--label)]"
  >
    <code>{children}</code>
  </pre>
);

export const PageBody = ({ children }: { children: ReactNode }) => (
  <article className="flex flex-col gap-12 pb-16 min-w-0">{children}</article>
);
