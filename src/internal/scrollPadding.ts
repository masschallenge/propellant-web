interface ScrollPaddingClaims {
  originalPadding: string;
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

const applyTallestClaim = (scroller: HTMLElement, claims: ScrollPaddingClaims) => {
  scroller.style.scrollPaddingTop = `${Math.max(...claims.heights.values())}px`;
};

export const reserveScrollPadding = (scroller: HTMLElement, owner: symbol, height: number) => {
  const claims = claimsByScroller.get(scroller) ?? {
    originalPadding: scroller.style.scrollPaddingTop,
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
