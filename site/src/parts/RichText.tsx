import { Code } from './Page';

export const InlineText = ({ text }: { text: string }) => (
  <>
    {text
      .split(/(`[^`]+`)/)
      .map((part, index) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <Code key={index}>{part.slice(1, -1)}</Code>
        ) : (
          part
        ),
      )}
  </>
);

export const Paragraphs = ({ text, className }: { text: string; className: string }) => (
  <>
    {text
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph, index) => (
        <p key={index} className={className}>
          <InlineText text={paragraph} />
        </p>
      ))}
  </>
);
