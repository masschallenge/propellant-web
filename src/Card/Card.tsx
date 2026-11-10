import * as React from 'react';
import type { ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import { IconButton } from '../IconButton/IconButton';
import { imageFitClass } from '../internal/imageFit';

export interface CardMenuItem {
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  onSelect?: () => void;
}

export type CardTone = 'default' | 'warning';

const TONE_SURFACE: Record<CardTone, string> = {
  default: 'bg-[var(--bg)]',
  warning: 'bg-[var(--warning-fill)]',
};

export interface CardProps extends Omit<React.ComponentPropsWithoutRef<'section'>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  media?: ReactNode;
  titleBadge?: string;
  titleBadgeDot?: boolean;
  actions?: ReactNode;
  menu?: CardMenuItem[];
  menuOpen?: boolean;
  headerDivider?: boolean;
  footer?: ReactNode;
  flush?: boolean;
  interactive?: boolean;
  tone?: CardTone;
  as?: React.ElementType;
  children?: ReactNode;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const HAIRLINE_BELOW =
  'border-0 border-b-[length:var(--hairline)] border-solid border-[var(--separator)]';
const HAIRLINE_ABOVE =
  'border-0 border-t-[length:var(--hairline)] border-solid border-[var(--separator)]';

const MoreGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="1.7" />
    <circle cx="12" cy="12" r="1.7" />
    <circle cx="19" cy="12" r="1.7" />
  </svg>
);

const headerPadding = (headerDivider: boolean, hasBody: boolean, flush: boolean) => {
  if (headerDivider) return joinClasses('pb-4', HAIRLINE_BELOW);
  if (!hasBody) return 'pb-5';
  return flush ? 'pb-4' : 'pb-0';
};

const bodyPadding = (flush: boolean, followsOpenHeader: boolean) => {
  if (flush) return undefined;
  return followsOpenHeader ? 'px-5 pt-3 pb-5' : 'p-5';
};

export const Card = ({
  title,
  description,
  media,
  titleBadge,
  titleBadgeDot = false,
  actions,
  menu,
  menuOpen,
  headerDivider = false,
  footer,
  flush = false,
  interactive = false,
  tone = 'default',
  as: Element = 'section',
  className,
  children,
  ...rest
}: CardProps) => {
  const [isMenuShown, setIsMenuShown] = React.useState(false);
  const menuAnchor = React.useRef<HTMLSpanElement>(null);
  const isControlled = menuOpen !== undefined;
  const isOpen = isControlled ? menuOpen : isMenuShown;

  React.useEffect(() => {
    if (!isOpen || isControlled) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (menuAnchor.current && !menuAnchor.current.contains(event.target as Node)) {
        setIsMenuShown(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuShown(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isControlled]);

  const hasHeader = Boolean(title || actions || description || media || menu);
  const hasBody = Boolean(children);

  return (
    <Element
      className={joinClasses(
        'flex flex-col rounded-[var(--corner-lg)] text-[var(--label)]',
        TONE_SURFACE[tone],
        !isOpen && 'overflow-hidden',
        interactive &&
          'cursor-pointer transition-colors duration-[var(--duration-instant)] ease-[var(--ease-standard)] hover:bg-[linear-gradient(var(--fill-tertiary),var(--fill-tertiary))] active:bg-[linear-gradient(var(--fill-secondary),var(--fill-secondary))] active:transition-none',
        className,
      )}
      {...rest}
    >
      {hasHeader ? (
        <div
          className={joinClasses(
            'flex items-start gap-4 px-5 pt-5',
            headerPadding(headerDivider, hasBody, flush),
          )}
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {media ? (
              typeof media === 'string' ? (
                <img
                  className={`flex-none w-[var(--avatar-lg)] h-[var(--avatar-lg)] rounded-full ${imageFitClass()} bg-[var(--bg-secondary)]`}
                  src={media}
                  alt=""
                />
              ) : (
                <span className="flex-none">{media}</span>
              )
            ) : null}
            <div className="flex-1 min-w-0">
              {title ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="m-0 text-headline text-[var(--label)]">{title}</h3>
                  {titleBadge ? (
                    <Badge
                      size="sm"
                      icon={
                        titleBadgeDot ? (
                          <span className="block w-1.5 h-1.5 m-[3px] rounded-full bg-[var(--success-solid)]" />
                        ) : undefined
                      }
                    >
                      {titleBadge}
                    </Badge>
                  ) : null}
                </div>
              ) : null}
              {description ? (
                <p className="m-0 mt-0.5 text-subheadline text-[var(--label-secondary)]">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          {actions || menu ? (
            <div className="flex items-center gap-2 flex-none flex-wrap">
              {actions}
              {menu ? (
                <span className="relative inline-flex" ref={menuAnchor}>
                  <IconButton
                    aria-label="More options"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={() => {
                      if (!isControlled) setIsMenuShown(!isMenuShown);
                    }}
                  >
                    <MoreGlyph />
                  </IconButton>
                  {isOpen ? (
                    <div
                      role="menu"
                      aria-label="Card actions"
                      className="absolute top-[calc(100%+var(--space-1))] right-0 z-[var(--layer-dropdown)] min-w-44 p-1 rounded-[var(--corner-lg)] bg-[var(--bg-elevated)] shadow-[var(--shadow-float)]"
                    >
                      {menu.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            item.onSelect?.();
                            if (!isControlled) setIsMenuShown(false);
                          }}
                          className={joinClasses(
                            'flex items-center gap-2 w-full min-h-[var(--control-sm)] px-2 py-1 border-0 bg-transparent rounded-[var(--corner-md)] font-[inherit] text-body text-left cursor-pointer',
                            'focus-visible:outline-none',
                            item.danger
                              ? 'text-[var(--critical)] hover:bg-[var(--critical-solid)] hover:text-[var(--on-critical)] focus-visible:bg-[var(--critical-solid)] focus-visible:text-[var(--on-critical)]'
                              : 'text-[var(--label)] hover:bg-[var(--tint)] hover:text-[var(--on-tint)] focus-visible:bg-[var(--tint)] focus-visible:text-[var(--on-tint)]',
                          )}
                        >
                          {item.icon ? (
                            <span
                              className="flex-none flex [&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:block"
                              aria-hidden="true"
                            >
                              {item.icon}
                            </span>
                          ) : null}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
      {hasBody ? (
        <div className={bodyPadding(flush, hasHeader && !headerDivider)}>{children}</div>
      ) : null}
      {footer ? (
        <div className={joinClasses('mt-auto flex items-center gap-3 px-5 py-3', HAIRLINE_ABOVE)}>
          {footer}
        </div>
      ) : null}
    </Element>
  );
};
