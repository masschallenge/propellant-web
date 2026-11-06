import type { ReactNode } from 'react';
import Markdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { siteHrefFor } from './docLinks';

const linkClass = 'text-[var(--tint)] underline-offset-2 hover:underline';

const componentsFor = (path: string): Components => ({
  h1: ({ children }) => (
    <h1 className="m-0 text-large-title text-[var(--label)] [text-wrap:balance]">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="m-0 mt-8 text-title2 text-[var(--label)] [text-wrap:balance]">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="m-0 mt-4 text-headline text-[var(--label)]">{children}</h3>,
  h4: ({ children }) => (
    <h4 className="m-0 text-subheadline font-semibold text-[var(--label)]">{children}</h4>
  ),
  p: ({ children }) => <p className="m-0 text-body text-[var(--label)]">{children}</p>,
  ul: ({ children }) => (
    <ul className="m-0 pl-5 list-disc flex flex-col gap-2 text-body text-[var(--label)] marker:text-[var(--label-tertiary)]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="m-0 pl-5 list-decimal flex flex-col gap-3 text-body text-[var(--label)] marker:text-[var(--label-tertiary)]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="[&>p]:mt-2 [&>pre]:mt-3">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  a: ({ href, children }) => {
    const target = href ? siteHrefFor(path, href) : null;
    if (!target) return <>{children}</>;
    const isExternal = /^https?:/.test(target);
    return (
      <a
        href={target}
        className={linkClass}
        {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </a>
    );
  },
  code: ({ children, className }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="font-[family-name:var(--type-family-mono)] text-[0.92em] px-1 py-px rounded-[var(--corner-sm)] bg-[var(--fill-tertiary)] text-[var(--label)] [overflow-wrap:anywhere]">
        {children}
      </code>
    ),
  pre: ({ children }) => (
    <pre className="m-0 p-4 overflow-x-auto rounded-[var(--corner-lg)] bg-[var(--bg)] text-footnote font-[family-name:var(--type-family-mono)] text-[var(--label)]">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-[var(--corner-lg)] bg-[var(--bg)]">
      <table className="w-full border-collapse text-callout text-[var(--label)]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="text-left font-normal text-footnote text-[var(--label-secondary)] px-4 py-2 border-b border-[var(--separator)]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="align-top px-4 py-2.5 border-b border-[var(--separator)]">{children}</td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="m-0 pl-4 border-l-2 border-[var(--separator-strong)] flex flex-col gap-2 text-[var(--label-secondary)]">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="m-0 border-0 border-t border-[var(--separator)]" />,
});

export const MarkdownPage = ({ path, source }: { path: string; source: string }): ReactNode => (
  <article className="flex flex-col gap-4 pb-16 min-w-0 max-w-[48rem]">
    <Markdown remarkPlugins={[remarkGfm]} components={componentsFor(path)}>
      {source}
    </Markdown>
  </article>
);
