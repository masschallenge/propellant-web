import { useState } from 'react';
import { Button, Switch } from '../../../src/index';
import { Code, PageBody, PageHeading, Prose, Rules, Section } from '../parts/Page';

const SPRINGS = [
  {
    name: 'Snappy',
    token: '--spring-snappy',
    className: 'ease-[var(--spring-snappy)] duration-[var(--spring-snappy-duration)]',
    use: 'Things a person moves directly: switches, segmented control thumbs, disclosure arrows.',
  },
  {
    name: 'Smooth',
    token: '--spring-smooth',
    className: 'ease-[var(--spring-smooth)] duration-[var(--spring-smooth-duration)]',
    use: 'Things that appear: popovers, sheets, the inspector panel.',
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
        lede="Good motion shows people where things came from and where they went, then gets out of the way. Ours is built from springs, so movement feels physical and settles naturally instead of stopping dead."
      />

      <Section title="Three springs" wide>
        <Prose>
          An easing is the curve that sets how something speeds up and slows down as it moves. CSS
          can express a spring as a <Code>linear()</Code> easing sampled from the physics, so
          Propellant needs no animation library. Press play to compare them.
        </Prose>
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
            'Feedback on press never animates. Every control highlights the moment it is pressed.',
            'Other color changes fade with --ease-standard over --duration-fade, 150ms.',
            'Things leave faster than they arrive, using --ease-exit.',
            'One coordinated movement per interaction. Nothing moves just to decorate.',
          ]}
        />
      </Section>

      <Section title="Reduced motion">
        <Prose>
          Some people turn on reduced motion in their system settings because movement makes them
          unwell or distracts them. For them we remove travel, not status. Under{' '}
          <Code>prefers-reduced-motion</Code> the spring durations collapse to a single millisecond,
          so a sheet appears in place and a switch knob lands without sliding. Spinners and progress
          indicators keep moving, because a frozen spinner looks like a page that has stopped
          working. That is why components never wrap a progress indicator in{' '}
          <Code>motion-safe:</Code>.
        </Prose>
      </Section>
    </PageBody>
  );
};
