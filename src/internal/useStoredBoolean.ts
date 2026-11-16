import * as React from 'react';

const listeners = new Set<() => void>();
const unsavedValues = new Map<string, boolean>();

const parseStored = (raw: string | null) => {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return null;
};

const readStored = (key: string) => {
  const unsaved = unsavedValues.get(key);
  if (unsaved !== undefined) return unsaved;
  try {
    return parseStored(window.localStorage.getItem(key));
  } catch {
    return null;
  }
};

const writeStored = (key: string, value: boolean) => {
  try {
    window.localStorage.setItem(key, String(value));
    unsavedValues.delete(key);
  } catch {
    unsavedValues.set(key, value);
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
};

export const useStoredBoolean = (key: string | undefined, fallback: boolean) => {
  const [localValue, setLocalValue] = React.useState(fallback);
  const value = React.useSyncExternalStore(
    subscribe,
    () => (key ? (readStored(key) ?? fallback) : localValue),
    () => (key ? fallback : localValue),
  );
  const setValue = React.useCallback(
    (nextValue: boolean) => {
      if (key) writeStored(key, nextValue);
      else setLocalValue(nextValue);
    },
    [key],
  );
  return [value, setValue] as const;
};
