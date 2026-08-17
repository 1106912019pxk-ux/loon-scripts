(function () {
  'use strict';

  if (window.__LIGHTNOVEL_MOBILE_R7_PATCH__) return;
  if (!/(^|\.)lightnovel\.fun$/i.test(location.hostname)) return;
  window.__LIGHTNOVEL_MOBILE_R7_PATCH__ = true;

  const style = document.createElement('style');
  style.id = 'lnf-mobile-r7-patch-style';
  style.textContent = `
    /* R7 = stable R3 + R6 final detail layout, but no visible jump. */

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
      transform: translateY(var(--lnf-cover-shift-r7, 0px)) !important;
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

    /* Preserve the confirmed “好书推荐” repair. */
    html.lnf-mobile-r3 .lnf-recommend-r7 {
      width: calc(100% - 24px) !important;
      max-width: calc(100% - 24px) !important;
      min-width: 0 !important;
      margin-left: 12px !important;
      margin-right: 12px !important;
      overflow: hidden !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r7 .lnf-recommend-fit-r7 {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r7 div,
    html.lnf-mobile-r3 .lnf-recommend-r7 section,
    html.lnf-mobile-r3 .lnf-recommend-r7 ul,
    html.lnf-mobile-r3 .lnf-recommend-r7 li,
    html.lnf-mobile-r3 .lnf-recommend-r7 a {
      min-width: 0 !important;
      max-width: 100% !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r7 img {
      max-width: 100% !important;
      height: auto !important;
      object-fit: cover !important;
    }

    /* Keep the native two masonry columns. Just move the two real column wrappers
       toward each other. This shrinks the center gutter while increasing edge breathing room. */
    html.lnf-mobile-r3 .lnf-native-col-left-r7 {
      position: relative !important;
      left: 14px !important;
    }
    html.lnf-mobile-r3 .lnf-native-col-right-r7 {
      position: relative !important;
      left: -14px !important;
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
      html.lnf-mobile-r3 .lnf-native-col-left-r7 { left: 10px !important; }
      html.lnf-mobile-r3 .lnf-native-col-right-r7 { left: -10px !important; }
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

    box.classList.add('lnf-recommend-r7');
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    qsa('div,section,ul,ol', box).forEach(el => {
      if (!visible(el)) return;
      const r = el.getBoundingClientRect();
      const tooWide = r.width > vw + 8 || el.scrollWidth > el.clientWidth + 8;
      if (!tooWide) return;
      if (qsa('img', el).filter(visible).length >= 2) el.classList.add('lnf-recommend-fit-r7');
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
    if (!info || !coverCol || !cover || !visible(info) || !visible(cover)) return false;

    const title = findBookTitle(info);
    if (!title) return false;

    coverCol.style.setProperty('--lnf-cover-shift-r7', '0px');
    const coverTop = cover.getBoundingClientRect().top;
    const titleTop = title.getBoundingClientRect().top;
    const delta = Math.max(-30, Math.min(100, Math.round(titleTop - coverTop)));
    coverCol.style.setProperty('--lnf-cover-shift-r7', delta + 'px');
    return true;
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
    /* Do not touch homepage recommendations or detail pages. */
    if (smallestExact('好书推荐') || smallestExact('目录')) return;
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

    wrappers.forEach(col => {
      const r = col.getBoundingClientRect();
      const mid = r.left + r.width / 2;
      col.classList.remove('lnf-native-col-left-r7', 'lnf-native-col-right-r7');
      col.classList.add(mid < center ? 'lnf-native-col-left-r7' : 'lnf-native-col-right-r7');
    });
  }

  function revealPreparedDetail() {
    const prehide = document.getElementById('lnf-r7-prehide');
    if (!prehide) return;
    requestAnimationFrame(() => requestAnimationFrame(() => prehide.remove()));
  }

  let timer = 0;
  function runNow() {
    fixRecommendations();
    alignCoverToTitle();
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
  setTimeout(revealPreparedDetail, 500);

  const observer = new MutationObserver(runSoon);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
