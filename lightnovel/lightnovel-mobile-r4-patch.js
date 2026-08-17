(function () {
  'use strict';

  if (window.__LIGHTNOVEL_MOBILE_R4_PATCH__) return;
  if (!/(^|\.)lightnovel\.fun$/i.test(location.hostname)) return;
  window.__LIGHTNOVEL_MOBILE_R4_PATCH__ = true;

  const style = document.createElement('style');
  style.id = 'lnf-mobile-r4-patch-style';
  style.textContent = `
    /* R4: keep R3 layout, only fine-tune the three confirmed areas. */

    /* Detail page: slightly larger cover and move it down a little. */
    html.lnf-mobile-r3 .lnf-book-hero-r3 {
      grid-template-columns: 124px minmax(0, 1fr) !important;
    }

    html.lnf-mobile-r3 .lnf-book-cover-col-r3 {
      width: 124px !important;
      max-width: 124px !important;
      padding-top: 14px !important;
    }

    html.lnf-mobile-r3 img.lnf-book-cover-r3 {
      width: 124px !important;
      max-width: 124px !important;
    }

    /* Only the homepage “好书推荐” area gets the R2-style width repair. */
    html.lnf-mobile-r3 .lnf-recommend-r4 {
      width: calc(100% - 24px) !important;
      max-width: calc(100% - 24px) !important;
      min-width: 0 !important;
      margin-left: 12px !important;
      margin-right: 12px !important;
      overflow: hidden !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r4 .lnf-recommend-fit-r4 {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r4 div,
    html.lnf-mobile-r3 .lnf-recommend-r4 section,
    html.lnf-mobile-r3 .lnf-recommend-r4 ul,
    html.lnf-mobile-r3 .lnf-recommend-r4 li,
    html.lnf-mobile-r3 .lnf-recommend-r4 a {
      min-width: 0 !important;
      max-width: 100% !important;
    }

    html.lnf-mobile-r3 .lnf-recommend-r4 img {
      max-width: 100% !important;
      height: auto !important;
      object-fit: cover !important;
    }

    @media (max-width: 380px) {
      html.lnf-mobile-r3 .lnf-book-hero-r3 {
        grid-template-columns: 112px minmax(0, 1fr) !important;
      }

      html.lnf-mobile-r3 .lnf-book-cover-col-r3,
      html.lnf-mobile-r3 img.lnf-book-cover-r3 {
        width: 112px !important;
        max-width: 112px !important;
      }

      html.lnf-mobile-r3 .lnf-book-cover-col-r3 {
        padding-top: 10px !important;
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
    return qsa('h1,h2,h3,h4,strong,b,div,span,a')
      .filter(visible)
      .filter(el => compact(el.textContent) === wanted)
      .sort((a, b) => a.children.length - b.children.length || a.textContent.length - b.textContent.length)[0] || null;
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

    box.classList.add('lnf-recommend-r4');

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    qsa('div,section,ul,ol', box).forEach(el => {
      if (!visible(el)) return;
      const r = el.getBoundingClientRect();
      const tooWide = r.width > vw + 8 || el.scrollWidth > el.clientWidth + 8;
      if (!tooWide) return;

      const imgs = qsa('img', el).filter(visible);
      if (imgs.length >= 2) el.classList.add('lnf-recommend-fit-r4');
    });
  }

  let timer = 0;
  function run() {
    clearTimeout(timer);
    timer = setTimeout(fixRecommendations, 30);
  }

  fixRecommendations();
  setTimeout(fixRecommendations, 220);
  setTimeout(fixRecommendations, 800);
  setTimeout(fixRecommendations, 1800);

  const observer = new MutationObserver(run);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
