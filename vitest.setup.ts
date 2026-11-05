import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/react';

configure({ asyncUtilTimeout: 5000 });

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

const emptyRect = (): DOMRect => {
  const rect = { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 };
  return { ...rect, toJSON: () => rect } as DOMRect;
};

if (!Range.prototype.getBoundingClientRect) {
  Range.prototype.getBoundingClientRect = emptyRect;
}
if (!Range.prototype.getClientRects) {
  Range.prototype.getClientRects = () =>
    Object.assign([], { item: () => null }) as unknown as DOMRectList;
}
if (!document.elementFromPoint) {
  document.elementFromPoint = () => null;
}
if (!Element.prototype.getClientRects) {
  Element.prototype.getClientRects = () =>
    Object.assign([], { item: () => null }) as unknown as DOMRectList;
}
