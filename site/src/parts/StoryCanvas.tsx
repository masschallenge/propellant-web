import { Component } from 'react';
import type { ReactNode } from 'react';
import type { SiteStory } from '../stories';

class StoryBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError = () => ({ failed: true });

  render = () =>
    this.state.failed ? (
      <p className="m-0 text-callout text-[var(--label-secondary)]">
        This example needs the Storybook environment and is shown there instead.
      </p>
    ) : (
      this.props.children
    );
}

const FRAMES: Record<string, string> = {
  fullscreen: 'h-[520px] overflow-auto [transform:translateZ(0)]',
  centered: 'flex items-center justify-center p-8 min-h-40',
  padded: 'p-6',
};

export const StoryCanvas = ({ story }: { story: SiteStory }) => (
  <figure className="m-0 flex flex-col gap-2 min-w-0">
    <figcaption className="text-subheadline font-medium text-[var(--label-secondary)]">
      {story.name}
    </figcaption>
    <div
      className={`min-w-0 rounded-[var(--corner-lg)] bg-[var(--bg-grouped)] shadow-[inset_0_0_0_1px_var(--separator)] overflow-x-auto ${FRAMES[story.layout] ?? FRAMES.padded}`}
    >
      <StoryBoundary>
        <story.Render />
      </StoryBoundary>
    </div>
  </figure>
);
