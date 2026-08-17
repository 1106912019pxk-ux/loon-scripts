(function () {
  'use strict';

  if (window.__LIGHTNOVEL_MOBILE_R8_PATCH__) return;
  if (!/(^|\.)lightnovel\.fun$/i.test(location.hostname)) return;
  window.__LIGHTNOVEL_MOBILE_R8_PATCH__ = true;

  const style = document.createElement('style');
  style.id = 'lnf-mobile-r8-patch-style';
  style.textContent = `
    /* R8 = R7 visual layout, tighter balanced two-column gutter, and locked detail-cover alignment. */

    html.lnf-mobile-r3 .lnf-book-hero-r3 {
      grid-template-columns: 136px minmax(0, 1fr) !important;
      gap: 12px 14px !important;
      align-items: start !important;
    }

    html.lnf-mobile-r3 .lnf-book-cover-col-r3 {
      width: 136px !important;
      max-width: 136px !important;
      padding: 0 !important;
      margin: 0 !important;
      align-self: start !important;
      background: transparent !important;
      border: 0 !important;
      box-shadow: none !important;
      overflow: visible !important;
      transform: translateY(var(--lnf-cover-shift-r8, 0px)) !important;
      transition: none !important;
      animation: none !important;
    }

    html.lnf-mobile-r3 .lnf-book-cover-col-r3 > * {
      margin-top: 0 !important;
      padding-top: 0 !important;
      background: transparent !important;
      border-top: 0 !important;
      box-shadow: none !important;
    }

    html.lnf-mobile-r3 img.lnf-book-cover-r3 {
      display: block !important;
      width: 136px !important;
      max-width: 136px !important;
      margin: 0 !important;
      padding: 0 !important;
      border-radius: 12px !important;
      transition: none !important;
      animation: none !important;
    }

    /* Preserve the confirmed “好书推荐” repair. */
    html.lnf-mobile-r3 .lnf-recommend-r8 {
      width: calc(100% - 24px) !important;
      max-width: calc(100% - 24px) !important;
      min-width: 0 !important;
      margin-left: 12px !important;
      margin-right: 12px !important;
      overflow: hidden !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r8 .lnf-recommend-fit-r8 {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r8 div,
    html.lnf-mobile-r3 .lnf-recommend-r8 section,
    html.lnf-mobile-r3 .lnf-recommend-r8 ul,
    html.lnf-mobile-r3 .lnf-recommend-r8 li,
    html.lnf-mobile-r3 .lnf-recommend-r8 a {
      min-width: 0 !important;
      max-width: 100% !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r8 img {
      max-width: 100% !important;
      height: auto !important;
      object-fit: cover !important;
    }

    /* Keep the site's native masonry columns, but balance the center gutter against
       the two outer margins. JS calculates the shift from the real viewport geometry. */
    html.lnf-mobile-r3 .lnf-native-col-left-r8,
    html.lnf-mobile-r3 .lnf-native-col-right-r8 {
      position: relative !important;
      left: var(--lnf-col-shift-r8, 0px) !important;
      transition: none !important;
    }

    @media (max-width: 380px) {
      html.lnf-mobile-r3 .lnf-book-hero-r3 {
        grid-template-columns: 126px minmax(0, 1fr) !important;
        gap: 10px 12px !important;
      }
      html.lnf-mobile-r3 .lnf-book-cover-col-r3,
      html.lnf-mobile-r3 img.lnf-book-cover-r3 {
        width: 126px !important;
        max-width: 126px !important;
      }
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const compact = (s) => String(s || '').replace(/\s+/g, '').trim();
  const visible = (el) => {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden';
  };

  function smallestExact(text) {
    const wanted = compact(text);
    return qsa('h1,h2,h3,h4,strong,b,div,span,a,button')
      .filter(visible)
      .filter(el => compact(el.textContent) === wanted)
      .sort((a, b) => a.children.length - b.children.length || a.textContent.length - b.textContent.length)[0] || null;
  }

  function portraitImages(root = document) {
    return qsa('img', root).filter(img => {
      if (!visible(img)) return false;
      const r = img.getBoundingClientRect();
      return r.width >= 90 && r.height >= 130 && r.height > r.width * 1.08;
    });
  }

  function fixRecommendations() {
    const heading = smallestExact('好书推荐');
    if (!heading) return;

    let box = heading.parentElement;
    while (box && box !== document.body) {
      const imgs = qsa('img', box).filter(visible);
      const links = qsa('a', box).filter(visible);
      if (imgs.length >= 4 && links.length >= 4) break;
      box = box.parentElement;
    }
    if (!box || box === document.body) return;

    box.classList.add('lnf-recommend-r8');
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    qsa('div,section,ul,ol', box).forEach(el => {
      if (!visible(el)) return;
      const r = el.getBoundingClientRect();
      const tooWide = r.width > vw + 8 || el.scrollWidth > el.clientWidth + 8;
      if (!tooWide) return;
      if (qsa('img', el).filter(visible).length >= 2) el.classList.add('lnf-recommend-fit-r8');
    });
  }

  function findBookTitle(info) {
    let title = qsa('h1,h2,h3', info).filter(visible)[0] || null;
    if (title) return title;
    return qsa('div,span,p,a', info)
      .filter(visible)
      .filter(el => {
        const t = compact(el.textContent);
        if (t.length < 3 || t.length > 80) return false;
        const fs = parseFloat(getComputedStyle(el).fontSize || '0');
        return fs >= 24;
      })
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0] || null;
  }

  let coverAlignmentLocked = false;
  let detailRevealScheduled = false;

  function alignCoverToTitle() {
    if (coverAlignmentLocked) return true;

    const info = document.querySelector('.lnf-book-info-r3');
    const coverCol = document.querySelector('.lnf-book-cover-col-r3');
    const cover = document.querySelector('img.lnf-book-cover-r3');
    if (!info || !coverCol || !cover || !visible(info) || !visible(cover)) return false;

    const title = findBookTitle(info);
    if (!title) return false;

    coverCol.style.setProperty('--lnf-cover-shift-r8', '0px');
    const coverTop = cover.getBoundingClientRect().top;
    const titleTop = title.getBoundingClientRect().top;
    const delta = Math.max(-30, Math.min(100, Math.round(titleTop - coverTop)));
    coverCol.style.setProperty('--lnf-cover-shift-r8', delta + 'px');
    return true;
  }

  function finishPreparedDetail() {
    if (coverAlignmentLocked) return;
    if (!alignCoverToTitle()) return;

    coverAlignmentLocked = true;
    const prehide = document.getElementById('lnf-r8-prehide');
    if (!prehide) return;

    requestAnimationFrame(() => requestAnimationFrame(() => prehide.remove()));
  }

  function schedulePreparedDetailReveal() {
    if (detailRevealScheduled || coverAlignmentLocked) return;
    const prehide = document.getElementById('lnf-r8-prehide');

    /* If prehide is absent, align once and freeze it. This prevents later MutationObserver
       passes from visibly moving the cover even on an unusual cache/injection path. */
    if (!prehide) {
      if (alignCoverToTitle()) coverAlignmentLocked = true;
      return;
    }

    if (!alignCoverToTitle()) return;
    detailRevealScheduled = true;

    let finished = false;
    const once = () => {
      if (finished) return;
      finished = true;
      requestAnimationFrame(() => requestAnimationFrame(finishPreparedDetail));
    };

    /* Give Safari a short window to settle fonts/layout while the detail body is still hidden.
       Never keep the page blank waiting indefinitely for a web font. */
    if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
      document.fonts.ready.then(once, once);
      setTimeout(once, 220);
    } else {
      setTimeout(once, 80);
    }
  }

  function findColumnWrapper(img, vw) {
    let el = img.parentElement;
    for (let i = 0; i < 8 && el && el !== document.body; i++, el = el.parentElement) {
      const r = el.getBoundingClientRect();
      const p = el.parentElement;
      if (!p) continue;
      const pr = p.getBoundingClientRect();
      const widthRatio = r.width / vw;
      const parentRatio = pr.width / vw;
      if (widthRatio >= 0.34 && widthRatio <= 0.49 && parentRatio >= 0.78) return el;
    }
    return null;
  }

  function tightenNativeColumns() {
    /* Detail pages are excluded. Recommendation cards are naturally too narrow to match
       findColumnWrapper(), so the Hot/Recent two-column area can still be repaired on home. */
    if (smallestExact('目录')) return;
    const hot = smallestExact('热门');
    const recent = smallestExact('最近更新');
    if (!hot || !recent) return;

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if (!vw) return;
    const center = vw / 2;
    const switchBottom = Math.max(hot.getBoundingClientRect().bottom, recent.getBoundingClientRect().bottom);
    const imgs = portraitImages().filter(img => img.getBoundingClientRect().top > switchBottom - 8);
    if (imgs.length < 4) return;

    const wrappers = new Set();
    imgs.forEach(img => {
      const col = findColumnWrapper(img, vw);
      if (col) wrappers.add(col);
    });
    if (wrappers.size < 2) return;

    const cols = [...wrappers]
      .map(el => ({ el, rect: el.getBoundingClientRect() }))
      .sort((a, b) => a.rect.left - b.rect.left);

    const left = cols.filter(x => x.rect.left + x.rect.width / 2 < center).pop();
    const right = cols.find(x => x.rect.left + x.rect.width / 2 >= center);
    if (!left || !right || left.el === right.el) return;

    [left.el, right.el].forEach(el => {
      el.classList.remove('lnf-native-col-left-r8', 'lnf-native-col-right-r8');
      el.style.setProperty('--lnf-col-shift-r8', '0px');
    });

    /* Reading the rect after zeroing the custom property forces the calculation to use the
       native geometry, so repeated observer passes do not compound the shift. */
    const lr = left.el.getBoundingClientRect();
    const rr = right.el.getBoundingClientRect();
    const outerLeft = Math.max(0, lr.left);
    const outerRight = Math.max(0, vw - rr.right);
    const outerAverage = (outerLeft + outerRight) / 2;
    const centerGap = Math.max(0, rr.left - lr.right);
    const cap = vw <= 380 ? 24 : 32;
    const shift = Math.max(0, Math.min(cap, Math.round((centerGap - outerAverage) / 3)));

    left.el.classList.add('lnf-native-col-left-r8');
    right.el.classList.add('lnf-native-col-right-r8');
    left.el.style.setProperty('--lnf-col-shift-r8', shift + 'px');
    right.el.style.setProperty('--lnf-col-shift-r8', (-shift) + 'px');
  }

  let timer = 0;
  function runNow() {
    fixRecommendations();
    tightenNativeColumns();
    if (!coverAlignmentLocked) {
      alignCoverToTitle();
      schedulePreparedDetailReveal();
    }
  }

  function runSoon() {
    clearTimeout(timer);
    timer = setTimeout(runNow, 70);
  }

  runNow();
  setTimeout(runNow, 180);
  setTimeout(runNow, 700);
  setTimeout(runNow, 1600);

  /* Absolute safety valve: a selector/site change must never leave the whole detail page hidden. */
  setTimeout(() => {
    const prehide = document.getElementById('lnf-r8-prehide');
    if (prehide) prehide.remove();
  }, 1500);

  const observer = new MutationObserver(runSoon);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
