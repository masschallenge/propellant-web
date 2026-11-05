import lockupColor from '../../../assets/brand/propellant-lockup-color.svg';
import lockupWhite from '../../../assets/brand/propellant-lockup-white.svg';
import markColor from '../../../assets/brand/propellant-mark-color.svg';
import markWhite from '../../../assets/brand/propellant-mark-white.svg';

const THEMED = {
  lockup: { light: lockupColor, dark: lockupWhite },
  mark: { light: markColor, dark: markWhite },
};

export const PropellantBrand = ({
  kind,
  className,
}: {
  kind: keyof typeof THEMED;
  className: string;
}) => (
  <>
    <img src={THEMED[kind].light} alt="Propellant" className={`propellant-on-light ${className}`} />
    <img src={THEMED[kind].dark} alt="Propellant" className={`propellant-on-dark ${className}`} />
  </>
);
