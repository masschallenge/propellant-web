import type { ComponentType, ReactNode } from 'react';
import { storyOrder } from 'virtual:propellant-site-data';

type StoryArgs = Record<string, unknown>;

interface StoryContext {
  args: StoryArgs;
  globals: Record<string, unknown>;
  parameters: Record<string, unknown>;
}

type Decorator = (Story: ComponentType, context: StoryContext) => ReactNode;

interface ArgType {
  mapping?: Record<string, unknown>;
}

interface Annotations {
  name?: string;
  args?: StoryArgs;
  argTypes?: Record<string, ArgType>;
  render?: (args: StoryArgs, context: StoryContext) => ReactNode;
  decorators?: Decorator[];
  tags?: string[];
  parameters?: { layout?: string };
}

interface MetaAnnotations extends Annotations {
  title: string;
  component?: ComponentType<StoryArgs>;
}

interface StoryModule {
  default: MetaAnnotations;
  [exportName: string]: unknown;
}

export interface SiteStory {
  id: string;
  name: string;
  layout: string;
  Render: ComponentType;
}

export interface StoryGroup {
  module: string;
  title: string;
  stories: SiteStory[];
}

const startCase = (exportName: string) => {
  const words = exportName.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(' ');
  return words
    .map((word, index) => (index === 0 ? word : word.toLowerCase()))
    .join(' ')
    .replace(/^Playground$/, 'Default');
};

const mapArgs = (args: StoryArgs, argTypes: Record<string, ArgType>) =>
  Object.fromEntries(
    Object.entries(args).map(([key, value]) => {
      const mapping = argTypes[key]?.mapping;
      return [
        key,
        mapping && typeof value === 'string' && value in mapping ? mapping[value] : value,
      ];
    }),
  );

const composeStory = (meta: MetaAnnotations, story: Annotations): ComponentType => {
  const args = mapArgs({ ...meta.args, ...story.args }, { ...meta.argTypes, ...story.argTypes });
  const context: StoryContext = {
    args,
    globals: {},
    parameters: { ...meta.parameters, ...story.parameters },
  };
  const renderStory = story.render ?? meta.render;
  const Component = meta.component;
  const Base = () => (
    <>{renderStory ? renderStory(args, context) : Component ? <Component {...args} /> : null}</>
  );
  const decorators = [...(story.decorators ?? []), ...(meta.decorators ?? [])];
  return decorators.reduce<ComponentType>((Inner, decorator) => {
    const Decorated = () => <>{decorator(Inner, context)}</>;
    return Decorated;
  }, Base);
};

const isStory = (value: unknown): value is Annotations =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const storyModules = import.meta.glob('../../src/*/*.stories.tsx', {
  eager: true,
}) as unknown as Record<string, StoryModule>;

export const storyGroups: StoryGroup[] = Object.entries(storyModules)
  .map(([filePath, storyModule]) => {
    const moduleName = filePath.split('/').slice(-2, -1)[0];
    const meta = storyModule.default;
    const order = storyOrder[moduleName] ?? [];
    const rank = (exportName: string) => {
      const position = order.indexOf(exportName);
      return position === -1 ? order.length : position;
    };
    const stories = Object.entries(storyModule)
      .sort(([first], [second]) => rank(first) - rank(second))
      .filter(([exportName, story]) => exportName !== 'default' && isStory(story))
      .map(([exportName, story]) => [exportName, story as Annotations] as const)
      .filter(([, story]) => !(story.tags ?? []).includes('!autodocs'))
      .map(([exportName, story]) => ({
        id: `${moduleName}-${exportName}`,
        name: story.name ?? startCase(exportName),
        layout: story.parameters?.layout ?? meta.parameters?.layout ?? 'padded',
        Render: composeStory(meta, story),
      }));
    return { module: moduleName, title: meta.title, stories };
  })
  .sort((first, second) => first.module.localeCompare(second.module));

export const storyGroupFor = (moduleName: string) =>
  storyGroups.find((group) => group.module === moduleName);
