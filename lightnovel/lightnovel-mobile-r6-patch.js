(function () {
  'use strict';

  if (window.__LIGHTNOVEL_MOBILE_R6_PATCH__) return;
  if (!/(^|\.)lightnovel\.fun$/i.test(location.hostname)) return;
  window.__LIGHTNOVEL_MOBILE_R6_PATCH__ = true;

  const style = document.createElement('style');
  style.id = 'lnf-mobile-r6-patch-style';
  style.textContent = `
    /* R6 = stable R3 + precise alignment/gutter fixes. */

    /* Detail page: keep the larger cover, remove the white top pad, then JS aligns
       the entire cover column to the actual title top with a transform. */
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
      transform: translateY(var(--lnf-cover-shift-r6, 0px)) !important;
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
    }

    /* Preserve the successful “好书推荐” repair from R4/R5. */
    html.lnf-mobile-r3 .lnf-recommend-r6 {
      width: calc(100% - 24px) !important;
      max-width: calc(100% - 24px) !important;
      min-width: 0 !important;
      margin-left: 12px !important;
      margin-right: 12px !important;
      overflow: hidden !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r6 .lnf-recommend-fit-r6 {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r6 div,
    html.lnf-mobile-r3 .lnf-recommend-r6 section,
    html.lnf-mobile-r3 .lnf-recommend-r6 ul,
    html.lnf-mobile-r3 .lnf-recommend-r6 li,
    html.lnf-mobile-r3 .lnf-recommend-r6 a {
      min-width: 0 !important;
      max-width: 100% !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r6 img {
      max-width: 100% !important;
      height: auto !important;
      object-fit: cover !important;
    }

    /* Native 热门/最近更新 two-column area: keep native cards, but make the actual
       two-column container a centered two-column grid with a small fixed middle gutter. */
    html.lnf-mobile-r3 .lnf-native-grid-r6 {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      column-gap: 10px !important;
      row-gap: 20px !important;
      width: calc(100% - 40px) !important;
      max-width: calc(100% - 40px) !important;
      margin-left: auto !important;
      margin-right: auto !important;
      padding: 0 !important;
      justify-content: center !important;
      align-items: start !important;
      box-sizing: border-box !important;
    }

    html.lnf-mobile-r3 .lnf-native-grid-r6 > * {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
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
      html.lnf-mobile-r3 .lnf-native-grid-r6 {
        width: calc(100% - 28px) !important;
        max-width: calc(100% - 28px) !important;
        column-gap: 8px !important;
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

    box.classList.add('lnf-recommend-r6');
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    qsa('div,section,ul,ol', box).forEach(el => {
      if (!visible(el)) return;
      const r = el.getBoundingClientRect();
      const tooWide = r.width > vw + 8 || el.scrollWidth > el.clientWidth + 8;
      if (!tooWide) return;
      if (qsa('img', el).filter(visible).length >= 2) el.classList.add('lnf-recommend-fit-r6');
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

  function alignCoverToTitle() {
    const info = document.querySelector('.lnf-book-info-r3');
    const coverCol = document.querySelector('.lnf-book-cover-col-r3');
    const cover = document.querySelector('img.lnf-book-cover-r3');
    if (!info || !coverCol || !cover || !visible(info) || !visible(cover)) return;

    const title = findBookTitle(info);
    if (!title) return;

    /* Reset first so repeated MutationObserver runs never accumulate the shift. */
    coverCol.style.setProperty('--lnf-cover-shift-r6', '0px');
    requestAnimationFrame(() => {
      if (!coverCol.isConnected || !cover.isConnected || !title.isConnected) return;
      const coverTop = cover.getBoundingClientRect().top;
      const titleTop = title.getBoundingClientRect().top;
      const delta = Math.max(-30, Math.min(100, Math.round(titleTop - coverTop)));
      coverCol.style.setProperty('--lnf-cover-shift-r6', delta + 'px');
    });
  }

  function centerNativeTwoColumnGrid() {
    if (smallestExact('好书推荐') || smallestExact('目录')) return;
    const hot = smallestExact('热门');
    const recent = smallestExact('最近更新');
    if (!hot || !recent) return;

    const switchBottom = Math.max(hot.getBoundingClientRect().bottom, recent.getBoundingClientRect().bottom);
    const imgs = portraitImages().filter(img => img.getBoundingClientRect().top > switchBottom - 8);
    if (imgs.length < 4) return;

    /* First two visible cards should be the two columns. Their LCA is usually the
       real card grid; stop there instead of climbing to a page-wide wrapper. */
    const grid = lca(imgs[0], imgs[1]);
    if (!grid || grid === document.body) return;
    if (portraitImages(grid).length >= 2) grid.classList.add('lnf-native-grid-r6');
  }

  let timer = 0;
  function runNow() {
    fixRecommendations();
    alignCoverToTitle();
    centerNativeTwoColumnGrid();
  }
  function runSoon() {
    clearTimeout(timer);
    timer = setTimeout(runNow, 90);
  }

  runNow();
  setTimeout(runNow, 220);
  setTimeout(runNow, 800);
  setTimeout(runNow, 1800);
  const observer = new MutationObserver(runSoon);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
