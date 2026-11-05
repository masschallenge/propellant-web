import { describe, expect as vitestExpect, it } from 'vitest';
import { expect, fn, userEvent, within } from './story-test-shim';

interface Passive {
  (...parameters: unknown[]): Passive;
  [property: string]: Passive;
}

describe('story test shim', () => {
  it('returns the given implementation or an inert handler', () => {
    const implementation = () => 'scored';
    vitestExpect(fn(implementation)).toBe(implementation);
    vitestExpect(fn()()).toBeUndefined();
  });

  it('accepts any chain of play function calls without acting', async () => {
    const passiveExpect = expect as Passive;
    const passiveWithin = within as Passive;
    const passiveUser = userEvent as Passive;
    vitestExpect(() => passiveExpect('value').not.toBe('other')).not.toThrow();
    vitestExpect(() => passiveWithin(document.body).getByRole('button')).not.toThrow();
    await vitestExpect(passiveUser.click('button')).toBe(passiveUser);
  });
});
