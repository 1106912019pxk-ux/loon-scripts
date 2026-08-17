(function () {
  'use strict';

  if (window.__LIGHTNOVEL_MOBILE_R5_PATCH__) return;
  if (!/(^|\.)lightnovel\.fun$/i.test(location.hostname)) return;
  window.__LIGHTNOVEL_MOBILE_R5_PATCH__ = true;

  const style = document.createElement('style');
  style.id = 'lnf-mobile-r5-patch-style';
  style.textContent = `
    /* R5 = stable R3 + very small visual refinements. */

    /* Detail page: a little larger; vertical position is calculated from the title. */
    html.lnf-mobile-r3 .lnf-book-hero-r3 {
      grid-template-columns: 136px minmax(0, 1fr) !important;
      gap: 12px 16px !important;
    }

    html.lnf-mobile-r3 .lnf-book-cover-col-r3 {
      width: 136px !important;
      max-width: 136px !important;
      padding-top: var(--lnf-cover-title-offset-r5, 0px) !important;
    }

    html.lnf-mobile-r3 img.lnf-book-cover-r3 {
      width: 136px !important;
      max-width: 136px !important;
    }

    /* Keep the successful R4 repair ONLY for “好书推荐”. */
    html.lnf-mobile-r3 .lnf-recommend-r5 {
      width: calc(100% - 24px) !important;
      max-width: calc(100% - 24px) !important;
      min-width: 0 !important;
      margin-left: 12px !important;
      margin-right: 12px !important;
      overflow: hidden !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r5 .lnf-recommend-fit-r5 {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r5 div,
    html.lnf-mobile-r3 .lnf-recommend-r5 section,
    html.lnf-mobile-r3 .lnf-recommend-r5 ul,
    html.lnf-mobile-r3 .lnf-recommend-r5 li,
    html.lnf-mobile-r3 .lnf-recommend-r5 a {
      min-width: 0 !important;
      max-width: 100% !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r5 img {
      max-width: 100% !important;
      height: auto !important;
      object-fit: cover !important;
    }

    /* Native two-column browse/result area: do NOT redesign cards; just pull the
       whole grid slightly inward so the outer gutters breathe and the middle gap shrinks. */
    html.lnf-mobile-r3 .lnf-native-grid-r5 {
      width: calc(100% - 28px) !important;
      max-width: calc(100% - 28px) !important;
      margin-left: auto !important;
      margin-right: auto !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      box-sizing: border-box !important;
    }

    @media (max-width: 380px) {
      html.lnf-mobile-r3 .lnf-book-hero-r3 {
        grid-template-columns: 124px minmax(0, 1fr) !important;
        gap: 10px 13px !important;
      }
      html.lnf-mobile-r3 .lnf-book-cover-col-r3,
      html.lnf-mobile-r3 img.lnf-book-cover-r3 {
        width: 124px !important;
        max-width: 124px !important;
      }
      html.lnf-mobile-r3 .lnf-native-grid-r5 {
        width: calc(100% - 20px) !important;
        max-width: calc(100% - 20px) !important;
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

  function lca(a, b) {
    if (!a || !b) return null;
    const seen = new Set();
    for (let x = a; x; x = x.parentElement) seen.add(x);
    for (let x = b; x; x = x.parentElement) if (seen.has(x)) return x;
    return null;
  }

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

    box.classList.add('lnf-recommend-r5');
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    qsa('div,section,ul,ol', box).forEach(el => {
      if (!visible(el)) return;
      const r = el.getBoundingClientRect();
      const tooWide = r.width > vw + 8 || el.scrollWidth > el.clientWidth + 8;
      if (!tooWide) return;
      if (qsa('img', el).filter(visible).length >= 2) el.classList.add('lnf-recommend-fit-r5');
    });
  }

  function alignCoverToTitle() {
    const hero = document.querySelector('.lnf-book-hero-r3');
    const info = document.querySelector('.lnf-book-info-r3');
    const coverCol = document.querySelector('.lnf-book-cover-col-r3');
    if (!hero || !info || !coverCol || !visible(hero) || !visible(info)) return;

    let title = qsa('h1,h2,h3', info).filter(visible)[0] || null;
    if (!title) {
      title = qsa('div,span,p,a', info)
        .filter(visible)
        .filter(el => {
          const t = compact(el.textContent);
          if (t.length < 4 || t.length > 80) return false;
          const fs = parseFloat(getComputedStyle(el).fontSize || '0');
          return fs >= 24;
        })
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0] || null;
    }
    if (!title) return;

    const heroTop = hero.getBoundingClientRect().top;
    const titleTop = title.getBoundingClientRect().top;
    const offset = Math.max(0, Math.min(90, Math.round(titleTop - heroTop)));
    coverCol.style.setProperty('--lnf-cover-title-offset-r5', offset + 'px');
  }

  function centerNativeTwoColumnGrid() {
    /* Only target pages that have the site's own 热门 / 最近更新 switch.
       This intentionally skips the homepage 好书推荐 and book detail pages. */
    if (smallestExact('好书推荐') || smallestExact('目录')) return;
    const hot = smallestExact('热门');
    const recent = smallestExact('最近更新');
    if (!hot || !recent) return;

    const switchBottom = Math.max(hot.getBoundingClientRect().bottom, recent.getBoundingClientRect().bottom);
    const imgs = portraitImages().filter(img => img.getBoundingClientRect().top > switchBottom - 8);
    if (imgs.length < 4) return;

    let grid = lca(imgs[0], imgs[1]);
    if (!grid || grid === document.body) return;

    let guard = 0;
    while (grid.parentElement && grid.parentElement !== document.body && guard++ < 5) {
      const count = portraitImages(grid).length;
      if (count >= 4) break;
      grid = grid.parentElement;
    }

    if (portraitImages(grid).length >= 4) grid.classList.add('lnf-native-grid-r5');
  }

  let timer = 0;
  function runNow() {
    fixRecommendations();
    alignCoverToTitle();
    centerNativeTwoColumnGrid();
  }
  function runSoon() {
    clearTimeout(timer);
    timer = setTimeout(runNow, 80);
  }

  runNow();
  setTimeout(runNow, 220);
  setTimeout(runNow, 800);
  setTimeout(runNow, 1800);
  const observer = new MutationObserver(runSoon);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
