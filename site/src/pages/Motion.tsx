import { useState } from 'react';
import { Button, Switch } from '../../../src/index';
import { Code, PageBody, PageHeading, Prose, Rules, Section } from '../parts/Page';

const SPRINGS = [
  {
    name: 'Snappy',
    token: '--spring-snappy',
    className: 'ease-[var(--spring-snappy)] duration-[var(--spring-snappy-duration)]',
    use: 'Direct manipulation: switches, segmented thumbs, disclosure chevrons.',
  },
  {
    name: 'Smooth',
    token: '--spring-smooth',
    className: 'ease-[var(--spring-smooth)] duration-[var(--spring-smooth-duration)]',
    use: 'Things that appear: popovers, sheets, the inspector.',
  },
  {
    name: 'Bouncy',
    token: '--spring-bouncy',
    className: 'ease-[var(--spring-bouncy)] duration-[var(--spring-bouncy-duration)]',
    use: 'Confirmation only, such as a submitted score. Never for navigation.',
  },
];

export const Motion = () => {
  const [isMoved, setIsMoved] = useState(false);
  return (
    <PageBody>
      <PageHeading
        title="Motion"
        lede="Motion in Propellant is built from springs. CSS can express a spring as a linear() easing sampled from the physics, so Propellant needs no animation library."
      />

      <Section title="Three springs" wide>
        <div className="flex flex-col gap-4 p-5 rounded-[var(--corner-lg)] bg-[var(--bg)]">
          {SPRINGS.map((spring) => (
            <div key={spring.name} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-headline text-[var(--label)]">{spring.name}</span>
                <Code>{spring.token}</Code>
              </div>
              <div className="relative h-8 rounded-[var(--corner-capsule)] bg-[var(--fill-tertiary)]">
                <span
                  className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-[var(--tint)] transition-transform ${spring.className}`}
                  style={{
                    transform: isMoved ? 'translateX(calc(min(560px, 70vw) - 2rem))' : 'none',
                  }}
                />
              </div>
              <span className="text-subheadline text-[var(--label-secondary)]">{spring.use}</span>
            </div>
          ))}
          <div>
            <Button variant="tinted" onClick={() => setIsMoved((current) => !current)}>
              {isMoved ? 'Send them back' : 'Play'}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Switch label="Try the snappy spring on a switch" defaultChecked />
        </div>
      </Section>

      <Section title="Rules">
        <Rules
          items={[
            'Press feedback never animates. Every control highlights the moment it is pressed.',
            'Color changes that are not presses fade with --ease-standard over --duration-fade, 150ms.',
            'Exits are quicker than entrances and use --ease-exit.',
            'One orchestrated movement per interaction. Nothing moves to decorate.',
          ]}
        />
      </Section>

      <Section title="Reduced motion">
        <Prose>
          Reduced motion removes travel, not status. Under <Code>prefers-reduced-motion</Code> the
          spring durations collapse to a single millisecond, so a sheet appears in place and a
          switch knob lands without sliding. Spinners and progress indicators keep moving, because a
          frozen spinner looks like a hung page. Components therefore never wrap a progress
          indicator in <Code>motion-safe:</Code>.
        </Prose>
      </Section>
    </PageBody>
  );
};
