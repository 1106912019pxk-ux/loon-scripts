(function () {
  'use strict';

  if (window.__LIGHTNOVEL_MOBILE_R1__) return;
  if (!/(^|\.)lightnovel\.fun$/i.test(location.hostname)) return;
  window.__LIGHTNOVEL_MOBILE_R1__ = true;
  document.documentElement.classList.add('lnf-mobile-r1');

  const style = document.createElement('style');
  style.id = 'lnf-mobile-r1-style';
  style.textContent = `
    html.lnf-mobile-r1,
    html.lnf-mobile-r1 body {
      width: 100% !important;
      max-width: 100vw !important;
      min-width: 0 !important;
      overflow-x: hidden !important;
    }

    html.lnf-mobile-r1 *,
    html.lnf-mobile-r1 *::before,
    html.lnf-mobile-r1 *::after {
      box-sizing: border-box !important;
    }

    html.lnf-mobile-r1 img,
    html.lnf-mobile-r1 video,
    html.lnf-mobile-r1 canvas,
    html.lnf-mobile-r1 svg,
    html.lnf-mobile-r1 iframe {
      max-width: 100% !important;
    }

    html.lnf-mobile-r1 .lnf-fit-wide {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }

    html.lnf-mobile-r1 table.lnf-fit-wide {
      table-layout: auto !important;
    }

    html.lnf-mobile-r1 .lnf-nav-wrap {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      gap: 8px 12px !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      white-space: normal !important;
      overflow: visible !important;
    }

    html.lnf-mobile-r1 .lnf-nav-wrap > * {
      flex: 0 0 auto !important;
      min-width: 0 !important;
      max-width: 100% !important;
    }

    html.lnf-mobile-r1 .lnf-searchbar {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) minmax(64px, 82px) !important;
      gap: 8px !important;
      align-items: center !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
    }

    html.lnf-mobile-r1 .lnf-searchbar input {
      width: 100% !important;
      min-width: 0 !important;
      max-width: 100% !important;
    }

    html.lnf-mobile-r1 .lnf-book-hero {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      overflow: hidden !important;
    }

    html.lnf-mobile-r1 .lnf-book-hero::after {
      content: '';
      display: block;
      clear: both;
    }

    html.lnf-mobile-r1 img.lnf-book-cover {
      float: left !important;
      width: 118px !important;
      max-width: 34vw !important;
      height: auto !important;
      max-height: none !important;
      margin: 0 14px 10px 0 !important;
      object-fit: cover !important;
      border-radius: 12px !important;
    }

    html.lnf-mobile-r1 .lnf-book-hero h1,
    html.lnf-mobile-r1 .lnf-book-hero h2,
    html.lnf-mobile-r1 .lnf-book-hero h3,
    html.lnf-mobile-r1 .lnf-book-hero p,
    html.lnf-mobile-r1 .lnf-book-hero div,
    html.lnf-mobile-r1 .lnf-book-hero span {
      min-width: 0 !important;
      max-width: 100% !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
    }

    html.lnf-mobile-r1 .lnf-toc {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      overflow: hidden !important;
    }

    html.lnf-mobile-r1 .lnf-toc-tabs {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      gap: 8px !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      overflow: visible !important;
      white-space: normal !important;
    }

    html.lnf-mobile-r1 .lnf-toc-tab {
      flex: 0 0 auto !important;
      max-width: calc(50vw - 24px) !important;
      min-width: 0 !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
    }

    html.lnf-mobile-r1 .lnf-chapter-link {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      height: auto !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
      word-break: break-word !important;
      line-height: 1.5 !important;
    }

    html.lnf-mobile-r1 .lnf-recommend-section {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      overflow: hidden !important;
    }

    html.lnf-mobile-r1 .lnf-recommend-section img {
      max-width: 100% !important;
      height: auto !important;
      object-fit: cover !important;
    }

    @media (max-width: 430px) {
      html.lnf-mobile-r1 img.lnf-book-cover {
        width: 104px !important;
        max-width: 32vw !important;
        margin-right: 12px !important;
      }

      html.lnf-mobile-r1 .lnf-nav-wrap {
        gap: 7px 10px !important;
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

  function smallestTextElement(text, root = document) {
    const wanted = compact(text);
    const list = qsa('h1,h2,h3,h4,strong,b,div,span,a,p', root)
      .filter(visible)
      .filter(el => compact(el.textContent) === wanted)
      .sort((a, b) => a.children.length - b.children.length || a.textContent.length - b.textContent.length);
    return list[0] || null;
  }

  function lowestCommonAncestor(a, b) {
    if (!a || !b) return null;
    const seen = new Set();
    let x = a;
    while (x) {
      seen.add(x);
      x = x.parentElement;
    }
    x = b;
    while (x) {
      if (seen.has(x)) return x;
      x = x.parentElement;
    }
    return null;
  }

  function fitWideElements() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if (!vw) return;

    const tags = 'main,section,article,header,footer,nav,form,div,table,ul,ol';
    qsa(tags).forEach(el => {
      if (!visible(el)) return;
      if (el.closest('#lnf-mobile-debug')) return;
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' || cs.position === 'absolute') return;
      const r = el.getBoundingClientRect();
      if (r.width <= vw + 8) return;

      const p = el.parentElement;
      if (p && p !== document.body && visible(p)) {
        const pr = p.getBoundingClientRect();
        if (pr.width > vw + 8 && !p.classList.contains('lnf-fit-wide')) return;
      }
      el.classList.add('lnf-fit-wide');
    });
  }

  function fixSearchbar() {
    const input = qsa('input').find(el => /搜书名|作者|关键词/.test(el.getAttribute('placeholder') || ''));
    if (!input) return;
    let form = input.closest('form');
    if (!form) form = input.parentElement;
    if (!form) return;
    form.classList.add('lnf-searchbar');
    form.classList.add('lnf-fit-wide');
  }

  function fixMenus() {
    const keywords = new Set(['动态', '排行', '热度', '新书', '轻小说', '原创', '同人', 'EPUB']);
    const items = qsa('a,button').filter(el => keywords.has(compact(el.textContent)));
    if (items.length < 4) return;

    const counts = new Map();
    items.forEach(item => {
      let p = item.parentElement;
      for (let i = 0; i < 4 && p && p !== document.body; i++, p = p.parentElement) {
        if (!counts.has(p)) counts.set(p, new Set());
        counts.get(p).add(compact(item.textContent));
      }
    });

    const candidate = [...counts.entries()]
      .filter(([, set]) => set.size >= 4)
      .map(([el, set]) => ({ el, n: set.size, len: compact(el.textContent).length }))
      .filter(x => x.len < 120)
      .sort((a, b) => b.n - a.n || a.el.children.length - b.el.children.length)[0];

    if (candidate) {
      candidate.el.classList.add('lnf-nav-wrap', 'lnf-fit-wide');
    }
  }

  function fixRecommendations() {
    const heading = smallestTextElement('好书推荐');
    if (!heading) return;

    let box = heading.parentElement;
    while (box && box !== document.body) {
      const imgs = qsa('img', box).filter(visible);
      const links = qsa('a', box).filter(visible);
      if (imgs.length >= 4 && links.length >= 4) break;
      box = box.parentElement;
    }
    if (!box || box === document.body) return;
    box.classList.add('lnf-recommend-section', 'lnf-fit-wide');
  }

  function fixBookPage() {
    const tocHeading = smallestTextElement('目录');
    if (!tocHeading) return;

    const tocTop = tocHeading.getBoundingClientRect().top + window.scrollY;
    const covers = qsa('img').filter(img => {
      if (!visible(img)) return false;
      const r = img.getBoundingClientRect();
      const top = r.top + window.scrollY;
      return top < tocTop && r.height >= 180 && r.width >= 100 && r.height > r.width * 1.05;
    });
    const cover = covers[covers.length - 1] || null;

    const shelf = qsa('a,button,div,span').find(el => visible(el) && compact(el.textContent) === '加入书架');
    if (cover) {
      cover.classList.add('lnf-book-cover');
      let hero = shelf ? lowestCommonAncestor(cover, shelf) : cover.parentElement;
      if (hero) {
        let guard = 0;
        while (hero.parentElement && hero.parentElement !== document.body && guard++ < 3) {
          const txt = compact(hero.textContent);
          if (txt.length > 40 && txt.length < 2500) break;
          hero = hero.parentElement;
        }
        hero.classList.add('lnf-book-hero', 'lnf-fit-wide');
      }
    }

    let toc = tocHeading.parentElement;
    while (toc && toc !== document.body) {
      const links = qsa('a', toc).filter(visible);
      if (links.length >= 4 && compact(toc.textContent).length > 30) break;
      toc = toc.parentElement;
    }
    if (!toc || toc === document.body) return;
    toc.classList.add('lnf-toc', 'lnf-fit-wide');

    const volumeRe = /^(?:\d+\s*卷(?:.*)?|\d+\s*巻(?:.*)?|.*卷特典.*)$/i;
    const volumeNodes = qsa('a,button,div,span', toc)
      .filter(visible)
      .filter(el => volumeRe.test(compact(el.textContent)) && compact(el.textContent).length < 24);

    const parentCounts = new Map();
    volumeNodes.forEach(node => {
      const p = node.parentElement;
      if (!p) return;
      if (!parentCounts.has(p)) parentCounts.set(p, []);
      parentCounts.get(p).push(node);
    });
    const tabs = [...parentCounts.entries()]
      .filter(([, nodes]) => nodes.length >= 2)
      .sort((a, b) => b[1].length - a[1].length)[0];
    if (tabs) {
      tabs[0].classList.add('lnf-toc-tabs', 'lnf-fit-wide');
      tabs[1].forEach(el => el.classList.add('lnf-toc-tab'));
    }

    qsa('a', toc).forEach(a => {
      const t = compact(a.textContent);
      if (!t || t.length < 4 || volumeRe.test(t)) return;
      a.classList.add('lnf-chapter-link');
    });
  }

  let running = false;
  function run() {
    if (running) return;
    running = true;
    try {
      fixSearchbar();
      fixMenus();
      fixRecommendations();
      fixBookPage();
      fitWideElements();
      requestAnimationFrame(fitWideElements);
    } finally {
      running = false;
    }
  }

  run();
  setTimeout(run, 180);
  setTimeout(run, 700);
  setTimeout(run, 1600);

  let timer = 0;
  const observer = new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(run, 120);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
