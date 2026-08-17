(function () {
  'use strict';

  if (window.__LIGHTNOVEL_MOBILE_R9_PATCH__) return;
  if (!/(^|\.)lightnovel\.fun$/i.test(location.hostname)) return;
  window.__LIGHTNOVEL_MOBILE_R9_PATCH__ = true;

  const style = document.createElement('style');
  style.id = 'lnf-mobile-r9-patch-style';
  style.textContent = `
    /* R9: keep R8's proven hot/recent gutter fix. On detail pages, keep the
       accepted top-aligned cover state instead of moving it down to the title,
       and enlarge the cover to use more of the free space on the left. */

    html.lnf-mobile-r3 .lnf-book-hero-r3 {
      grid-template-columns: 152px minmax(0, 1fr) !important;
      gap: 12px 12px !important;
      align-items: start !important;
      width: calc(100% - 16px) !important;
      max-width: calc(100% - 16px) !important;
      margin-left: 8px !important;
      margin-right: 8px !important;
    }

    html.lnf-mobile-r3 .lnf-book-cover-col-r3 {
      width: 152px !important;
      max-width: 152px !important;
      padding: 0 !important;
      margin: 0 !important;
      align-self: start !important;
      background: transparent !important;
      border: 0 !important;
      box-shadow: none !important;
      overflow: visible !important;
      transform: none !important;
      transition: none !important;
      animation: none !important;
    }

    html.lnf-mobile-r3 .lnf-book-cover-col-r3 > * {
      margin-top: 0 !important;
      padding-top: 0 !important;
      background: transparent !important;
      border-top: 0 !important;
      box-shadow: none !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 img.lnf-book-cover-r3 {
      display: block !important;
      width: 152px !important;
      max-width: 152px !important;
      margin: 0 !important;
      padding: 0 !important;
      border-radius: 12px !important;
      transform: none !important;
      transition: none !important;
      animation: none !important;
    }

    /* Preserve the confirmed “好书推荐” repair. */
    html.lnf-mobile-r3 .lnf-recommend-r9 {
      width: calc(100% - 24px) !important;
      max-width: calc(100% - 24px) !important;
      min-width: 0 !important;
      margin-left: 12px !important;
      margin-right: 12px !important;
      overflow: hidden !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r9 .lnf-recommend-fit-r9 {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r9 div,
    html.lnf-mobile-r3 .lnf-recommend-r9 section,
    html.lnf-mobile-r3 .lnf-recommend-r9 ul,
    html.lnf-mobile-r3 .lnf-recommend-r9 li,
    html.lnf-mobile-r3 .lnf-recommend-r9 a {
      min-width: 0 !important;
      max-width: 100% !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r9 img {
      max-width: 100% !important;
      height: auto !important;
      object-fit: cover !important;
    }

    html.lnf-mobile-r3 .lnf-native-col-left-r9,
    html.lnf-mobile-r3 .lnf-native-col-right-r9 {
      position: relative !important;
      left: var(--lnf-col-shift-r9, 0px) !important;
      transition: none !important;
    }

    @media (max-width: 380px) {
      html.lnf-mobile-r3 .lnf-book-hero-r3 {
        grid-template-columns: 140px minmax(0, 1fr) !important;
        gap: 10px 10px !important;
        width: calc(100% - 12px) !important;
        max-width: calc(100% - 12px) !important;
        margin-left: 6px !important;
        margin-right: 6px !important;
      }
      html.lnf-mobile-r3 .lnf-book-cover-col-r3,
      html.lnf-mobile-r3 img.lnf-book-cover-r3 {
        width: 140px !important;
        max-width: 140px !important;
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

    box.classList.add('lnf-recommend-r9');
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    qsa('div,section,ul,ol', box).forEach(el => {
      if (!visible(el)) return;
      const r = el.getBoundingClientRect();
      const tooWide = r.width > vw + 8 || el.scrollWidth > el.clientWidth + 8;
      if (!tooWide) return;
      if (qsa('img', el).filter(visible).length >= 2) el.classList.add('lnf-recommend-fit-r9');
    });
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
      el.classList.remove('lnf-native-col-left-r9', 'lnf-native-col-right-r9');
      el.style.setProperty('--lnf-col-shift-r9', '0px');
    });

    const lr = left.el.getBoundingClientRect();
    const rr = right.el.getBoundingClientRect();
    const outerLeft = Math.max(0, lr.left);
    const outerRight = Math.max(0, vw - rr.right);
    const outerAverage = (outerLeft + outerRight) / 2;
    const centerGap = Math.max(0, rr.left - lr.right);
    const cap = vw <= 380 ? 24 : 32;
    const shift = Math.max(0, Math.min(cap, Math.round((centerGap - outerAverage) / 3)));

    left.el.classList.add('lnf-native-col-left-r9');
    right.el.classList.add('lnf-native-col-right-r9');
    left.el.style.setProperty('--lnf-col-shift-r9', shift + 'px');
    right.el.style.setProperty('--lnf-col-shift-r9', (-shift) + 'px');
  }

  function revealPreparedDetail() {
    const prehide = document.getElementById('lnf-r9-prehide');
    if (!prehide) return;
    requestAnimationFrame(() => requestAnimationFrame(() => prehide.remove()));
  }

  let timer = 0;
  function runNow() {
    fixRecommendations();
    tightenNativeColumns();
    revealPreparedDetail();
  }
  function runSoon() {
    clearTimeout(timer);
    timer = setTimeout(runNow, 70);
  }

  runNow();
  setTimeout(runNow, 180);
  setTimeout(runNow, 700);
  setTimeout(runNow, 1600);
  setTimeout(revealPreparedDetail, 600);

  const observer = new MutationObserver(runSoon);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
