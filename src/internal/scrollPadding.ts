interface ScrollPaddingClaims {
  originalPadding: string;
  basePadding: number;
  heights: Map<symbol, number>;
}

const SCROLLING_OVERFLOW = /(auto|scroll|overlay|hidden)/;

const claimsByScroller = new WeakMap<HTMLElement, ScrollPaddingClaims>();

export const scrollContainerOf = (element: HTMLElement): HTMLElement => {
  for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
    if (ancestor === document.body || ancestor === document.documentElement) break;
    if (SCROLLING_OVERFLOW.test(getComputedStyle(ancestor).overflowY)) return ancestor;
  }
  return document.documentElement;
};

const paddingInPixels = (scroller: HTMLElement) =>
  parseFloat(getComputedStyle(scroller).scrollPaddingTop) || 0;

const applyTallestClaim = (scroller: HTMLElement, claims: ScrollPaddingClaims) => {
  const tallestClaim = Math.max(...claims.heights.values());
  scroller.style.scrollPaddingTop = `${claims.basePadding + tallestClaim}px`;
};

export const reserveScrollPadding = (scroller: HTMLElement, owner: symbol, height: number) => {
  const claims = claimsByScroller.get(scroller) ?? {
    originalPadding: scroller.style.scrollPaddingTop,
    basePadding: paddingInPixels(scroller),
    heights: new Map<symbol, number>(),
  };
  claimsByScroller.set(scroller, claims);
  claims.heights.set(owner, height);
  applyTallestClaim(scroller, claims);
};

export const releaseScrollPadding = (scroller: HTMLElement, owner: symbol) => {
  const claims = claimsByScroller.get(scroller);
  if (!claims?.heights.delete(owner)) return;
  if (claims.heights.size) {
    applyTallestClaim(scroller, claims);
    return;
  }
  scroller.style.scrollPaddingTop = claims.originalPadding;
  claimsByScroller.delete(scroller);
};
