import * as React from 'react';
import type { ReactNode } from 'react';
import { Avatar } from '../Avatar/Avatar';
import { StatusIcon } from '../StatusIcon/StatusIcon';

export type EmptyStateVisual =
  'icon' | 'illustration' | 'file' | 'avatar-radius' | 'avatar-row' | 'avatar-grid';

export interface EmptyStateTile {
  src?: string;
  icon?: ReactNode;
  brand?: boolean;
}

export interface EmptyStateProps {
  title: string;
  titleAs?: 'h2' | 'h3' | 'h4' | 'p';
  description?: ReactNode;
  icon?: ReactNode;
  rings?: boolean;
  visual?: EmptyStateVisual;
  avatars?: string[];
  tiles?: EmptyStateTile[];
  actions?: ReactNode;
  framed?: boolean;
  live?: boolean;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const SearchGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const FileGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </svg>
);

const EmptySymbol = ({ children }: { children: ReactNode }) => (
  <StatusIcon tone="neutral" size="lg">
    {children}
  </StatusIcon>
);

const Tile = ({ tile }: { tile: EmptyStateTile }) => (
  <span
    className={joinClasses(
      'flex-none w-10 h-10 rounded-[var(--corner-md)] flex items-center justify-center overflow-hidden bg-[var(--fill-tertiary)] [&>svg]:w-[var(--icon-lg)] [&>svg]:h-[var(--icon-lg)]',
      tile.brand ? 'text-[var(--label-secondary)]' : 'text-[var(--label-tertiary)]',
    )}
  >
    {tile.src ? <img src={tile.src} alt="" className="w-full h-full object-cover" /> : tile.icon}
  </span>
);

const renderVisual = (
  visual: EmptyStateVisual,
  icon: ReactNode,
  avatars: string[],
  tiles: EmptyStateTile[],
) => {
  if (visual === 'avatar-radius' || visual === 'avatar-row') {
    const shown = avatars.slice(0, visual === 'avatar-row' ? 4 : 6);
    if (shown.length === 0) return <EmptySymbol>{icon || <SearchGlyph />}</EmptySymbol>;
    return (
      <span className="flex items-center [&>*:not(:first-child)]:-ml-2">
        {shown.map((source) => (
          <Avatar key={source} src={source} size="md" ring />
        ))}
      </span>
    );
  }
  if (visual === 'avatar-grid') {
    if (tiles.length === 0) return <EmptySymbol>{icon || <SearchGlyph />}</EmptySymbol>;
    return (
      <span className="flex flex-wrap justify-center gap-2 max-w-[296px]">
        {tiles.map((tile, position) => (
          <Tile key={tile.src ?? position} tile={tile} />
        ))}
      </span>
    );
  }
  if (visual === 'file') return <EmptySymbol>{icon || <FileGlyph />}</EmptySymbol>;
  return <EmptySymbol>{icon || <SearchGlyph />}</EmptySymbol>;
};

export const EmptyState = ({
  title,
  titleAs: TitleElement = 'h2',
  description,
  icon,
  visual = 'icon',
  avatars = [],
  tiles = [],
  actions,
  framed = true,
  live = false,
  className,
}: EmptyStateProps) => {
  const body = (
    <div
      data-visual={visual}
      data-live={live || undefined}
      className="flex flex-col items-center text-center max-w-[360px] w-full"
    >
      <div className="flex items-center justify-center mb-3" aria-hidden="true">
        {renderVisual(visual, icon, avatars, tiles)}
      </div>
      <TitleElement className="m-0 text-title3 text-[var(--label)] text-balance">
        {title}
      </TitleElement>
      {description ? (
        <p className="m-0 mt-1 text-callout text-[var(--label-secondary)] text-pretty">
          {description}
        </p>
      ) : null}
      {actions ? <div className="flex flex-wrap justify-center gap-2 mt-5">{actions}</div> : null}
    </div>
  );

  if (!framed) return <div className={joinClasses('flex justify-center', className)}>{body}</div>;
  return (
    <div
      className={joinClasses(
        'flex justify-center px-6 py-10 rounded-[var(--corner-lg)] bg-[var(--bg)]',
        className,
      )}
    >
      {body}
    </div>
  );
};
