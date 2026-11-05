type Callable = (...parameters: unknown[]) => unknown;

const inert: Callable = () => undefined;

const passive: unknown = new Proxy(() => passive, {
  get: (_target, property) => (property === 'then' ? undefined : passive),
});

export const fn = (implementation: Callable = inert): Callable => implementation;
export const expect = passive;
export const userEvent = passive;
export const within = passive;
export const waitFor = passive;
