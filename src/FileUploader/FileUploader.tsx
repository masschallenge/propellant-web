import * as React from 'react';
import { IconButton } from '../IconButton/IconButton';
import { ErrorGlyph } from '../TextField/fieldText';

export interface FileUploaderProps {
  label?: string;
  ctaLabel?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  onFiles?: (files: FileList) => void;
  className?: string;
}

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const dropZoneTone = (isDisabled: boolean, isDragging: boolean, hasError: boolean) => {
  if (isDisabled)
    return 'border-dashed bg-[var(--bg)] border-[var(--control-border)] opacity-[var(--opacity-disabled)] cursor-not-allowed';
  if (isDragging) return 'border-solid bg-[var(--tint-fill)] border-[var(--tint)]';
  return joinClasses(
    'border-dashed bg-[var(--bg)] hover:bg-[var(--bg-secondary)]',
    hasError ? 'border-[var(--critical)]' : 'border-[var(--control-border)]',
  );
};

export const FileUploader = ({
  label = 'Drag and drop files here, or',
  ctaLabel = 'browse',
  hint = 'PDF, DOCX or PNG up to 10 MB',
  accept,
  multiple = false,
  disabled = false,
  error = false,
  onFiles,
  className,
}: FileUploaderProps) => {
  const inputId = React.useId();
  const hintId = `${inputId}-hint`;
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        if (!disabled) onFiles?.(event.dataTransfer.files);
      }}
      onClick={(event) => {
        if (disabled || !inputRef.current) return;
        if ((event.target as Element).closest('label, input')) return;
        inputRef.current.click();
      }}
      className={joinClasses(
        'relative flex flex-col items-center gap-2 px-6 py-6 text-center rounded-[var(--corner-lg)] border cursor-pointer',
        'transition-colors duration-[var(--duration-fade)] ease-[var(--ease-standard)]',
        'has-[input:focus-visible]:outline-[length:var(--focus-width)] has-[input:focus-visible]:outline-solid has-[input:focus-visible]:outline-offset-[var(--focus-offset)] has-[input:focus-visible]:outline-[var(--focus-color)]',
        dropZoneTone(disabled, isDragging, error),
        className,
      )}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-describedby={hint ? hintId : undefined}
        aria-invalid={error || undefined}
        onChange={(event) => {
          if (event.target.files) onFiles?.(event.target.files);
        }}
        className="absolute w-px h-px p-0 -m-px overflow-hidden border-0 clip-[rect(0,0,0,0)]"
      />
      <svg
        viewBox="0 0 24 24"
        className="block flex-none w-[var(--icon-xl)] h-[var(--icon-xl)] text-[var(--label-tertiary)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 16V4M7 9l5-5 5 5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      </svg>
      <label
        htmlFor={inputId}
        className="text-callout text-[var(--label-secondary)] cursor-[inherit]"
      >
        {label}{' '}
        <span
          className={joinClasses(
            "relative inline-flex items-center font-semibold rounded-[var(--corner-sm)] before:content-[''] before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:h-[var(--hit-target)]",
            disabled ? 'text-[var(--label-quaternary)]' : 'text-[var(--tint)]',
          )}
        >
          {ctaLabel}
        </span>
      </label>
      {hint ? (
        <span
          id={hintId}
          className={joinClasses(
            'text-footnote',
            error
              ? 'inline-flex items-start gap-1 text-[var(--critical)]'
              : 'text-[var(--label-tertiary)]',
          )}
        >
          {error ? <ErrorGlyph /> : null}
          {hint}
        </span>
      ) : null}
    </div>
  );
};

export type FileRowStatus = 'uploading' | 'done' | 'failed';
export type FileRowBadgeTone = 'brand' | 'danger' | 'success';

export interface FileRowProps {
  name: string;
  meta?: string;
  progress?: number;
  status?: FileRowStatus;
  progressStyle?: 'fill' | 'bar';
  badge?: { text: string; tone?: FileRowBadgeTone };
  onRetry?: () => void;
  onRemove?: () => void;
  className?: string;
}

const BADGE_FILL: Record<FileRowBadgeTone, string> = {
  brand: 'fill-[var(--tint)]',
  danger: 'fill-[var(--critical-solid)]',
  success: 'fill-[var(--success-solid)]',
};

const BADGE_TEXT: Record<FileRowBadgeTone, string> = {
  brand: 'fill-[var(--on-tint)]',
  danger: 'fill-[var(--on-critical)]',
  success: 'fill-[var(--on-success)]',
};

const STATUS_TONE: Record<FileRowStatus, string> = {
  failed: 'text-[var(--critical)]',
  done: 'text-[var(--success)]',
  uploading: 'text-[var(--label-secondary)]',
};

const STATUS_GLYPH: Record<FileRowStatus, string> = {
  done: 'M5 13l4 4L19 7',
  failed: 'M18 6 6 18M6 6l12 12',
  uploading: 'M12 3v4M12 17v4M3 12h4M17 12h4',
};

const FileGlyph = ({ badge }: { badge?: FileRowProps['badge'] }) => {
  if (!badge) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="block w-full h-full p-1 text-[var(--label-tertiary)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8ZM14 3v5h5" />
      </svg>
    );
  }
  const tone = badge.tone || 'brand';
  return (
    <svg viewBox="0 0 38 38" className="block w-full h-full">
      <path
        d="M9 2h13l10 10v22a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
        className="fill-[var(--bg)] stroke-[var(--control-border)]"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M22 2v8a2 2 0 0 0 2 2h8"
        className="fill-none stroke-[var(--control-border)]"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <rect x="4" y="20" width="24" height="12" rx="2.5" className={BADGE_FILL[tone]} />
      <text
        x="16"
        y="29"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="600"
        className={joinClasses('font-[inherit]', BADGE_TEXT[tone])}
      >
        {badge.text}
      </text>
    </svg>
  );
};

export const FileRow = ({
  name,
  meta,
  progress = 100,
  status = 'done',
  progressStyle = 'fill',
  badge,
  onRetry,
  onRemove,
  className,
}: FileRowProps) => {
  const statusText =
    status === 'done'
      ? 'Uploaded'
      : status === 'failed'
        ? 'Upload failed'
        : `${progress}% uploaded`;
  return (
    <div
      className={joinClasses(
        'relative flex items-start gap-3 p-3 overflow-hidden rounded-[var(--corner-lg)]',
        status === 'failed' ? 'bg-[var(--critical-fill)]' : 'bg-[var(--bg)]',
        className,
      )}
    >
      {status === 'uploading' && progressStyle === 'fill' ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 origin-left bg-[var(--tint-fill)] transition-transform duration-[var(--spring-smooth-duration)] ease-[var(--spring-smooth)]"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      ) : null}
      <span className="relative flex-none w-9 h-9" aria-hidden="true">
        <FileGlyph badge={badge} />
      </span>
      <div className="relative flex flex-col flex-1 gap-0.5 min-w-0">
        <span className="truncate text-callout font-medium text-[var(--label)]">{name}</span>
        {meta ? <span className="text-footnote text-[var(--label-tertiary)]">{meta}</span> : null}
        <span
          className={joinClasses(
            'inline-flex items-center gap-1.5 text-footnote',
            STATUS_TONE[status],
          )}
          role="status"
          aria-live={status === 'uploading' ? 'polite' : undefined}
        >
          <svg
            viewBox="0 0 24 24"
            className="flex-none w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={STATUS_GLYPH[status]} />
          </svg>
          {statusText}
          {status === 'failed' && onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="relative p-0 border-0 bg-transparent cursor-pointer font-[inherit] text-footnote font-semibold underline underline-offset-2 text-[var(--critical)] rounded-[var(--corner-sm)] focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color-critical)] before:content-[''] before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:h-[var(--hit-target)]"
            >
              Try again
            </button>
          ) : null}
        </span>
        {status === 'uploading' && progressStyle === 'bar' ? (
          <span className="flex items-center gap-3 mt-1">
            <span
              className="relative flex-1 h-1 overflow-hidden rounded-full bg-[var(--fill-secondary)]"
              role="progressbar"
              aria-label={`${name} upload`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <span
                className="absolute top-0 bottom-0 left-0 rounded-full bg-[var(--tint)]"
                style={{ width: `${progress}%` }}
              />
            </span>
            <span className="flex-none text-footnote font-medium tabular-nums text-[var(--label-secondary)]">
              {progress}%
            </span>
          </span>
        ) : null}
      </div>
      {onRemove ? (
        <IconButton size="sm" aria-label={`Remove ${name}`} onClick={onRemove}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </IconButton>
      ) : null}
    </div>
  );
};
