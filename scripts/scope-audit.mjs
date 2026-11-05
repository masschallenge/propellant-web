import postcss from 'postcss';

export const BOUNDARY = '[data-propellant]';

const isKeyframeStep = (rule) =>
  rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name);

export const auditScopedCss = (scopedCss) => {
  const root = postcss.parse(scopedCss);
  const unscoped = [];
  const definedNames = new Set();
  root.walkRules((rule) => {
    if (isKeyframeStep(rule)) return;
    if (!rule.selectors.every((selector) => selector.includes(BOUNDARY))) {
      unscoped.push(rule.selector.slice(0, 120));
    }
    rule.walkDecls((declaration) => {
      if (declaration.prop.startsWith('--')) definedNames.add(declaration.prop);
    });
  });
  return { unscoped, definedNames };
};
