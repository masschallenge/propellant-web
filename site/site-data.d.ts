/// <reference types="vite/client" />

declare module 'virtual:propellant-site-data' {
  import type { ComponentEntry } from './tooling/components';
  import type { TokenEntry } from './tooling/tokens';

  export const version: string;
  export const storyOrder: Record<string, string[]>;
  export const foundationGroups: string[];
  export const tokens: TokenEntry[];
  export const components: ComponentEntry[];
}
