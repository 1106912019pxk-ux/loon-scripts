(function () {
  'use strict';

  if (window.__LIGHTNOVEL_MOBILE_R3__) return;
  if (!/(^|\.)lightnovel\.fun$/i.test(location.hostname)) return;
  window.__LIGHTNOVEL_MOBILE_R3__ = true;
  document.documentElement.classList.add('lnf-mobile-r3');

  const style = document.createElement('style');
  style.id = 'lnf-mobile-r3-style';
  style.textContent = `
    html.lnf-mobile-r3,
    html.lnf-mobile-r3 body {
      max-width: 100vw !important;
      overflow-x: hidden !important;
    }

    html.lnf-mobile-r3 *,
    html.lnf-mobile-r3 *::before,
    html.lnf-mobile-r3 *::after {
      box-sizing: border-box !important;
    }

    /* R3 intentionally leaves the site's native search bar and book grids alone. */

    html.lnf-mobile-r3 .lnf-nav-r3 {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      align-content: flex-start !important;
      gap: 8px 14px !important;
      width: calc(100% - 24px) !important;
      max-width: calc(100% - 24px) !important;
      min-width: 0 !important;
      height: auto !important;
      min-height: 0 !important;
      margin-left: 12px !important;
      margin-right: 12px !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      white-space: normal !important;
      overflow: visible !important;
      overflow-x: visible !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-nav-r3 > * {
      flex: 0 0 auto !important;
      width: auto !important;
      max-width: 100% !important;
      min-width: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      white-space: nowrap !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-book-hero-r3 {
      display: grid !important;
      grid-template-columns: 112px minmax(0, 1fr) !important;
      grid-auto-flow: row !important;
      align-items: start !important;
      gap: 12px 14px !important;
      width: calc(100% - 24px) !important;
      max-width: calc(100% - 24px) !important;
      min-width: 0 !important;
      height: auto !important;
      min-height: 0 !important;
      margin-left: 12px !important;
      margin-right: 12px !important;
      overflow: visible !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-book-cover-col-r3 {
      grid-column: 1 !important;
      width: 112px !important;
      max-width: 112px !important;
      min-width: 0 !important;
      height: auto !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 img.lnf-book-cover-r3 {
      display: block !important;
      float: none !important;
      position: static !important;
      width: 112px !important;
      max-width: 112px !important;
      min-width: 0 !important;
      height: auto !important;
      max-height: none !important;
      margin: 0 !important;
      object-fit: cover !important;
      border-radius: 12px !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-book-info-r3 {
      grid-column: 2 !important;
      width: auto !important;
      max-width: 100% !important;
      min-width: 0 !important;
      height: auto !important;
      min-height: 0 !important;
      margin: 0 !important;
      overflow: visible !important;
      white-space: normal !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-book-info-r3 > * {
      width: auto !important;
      max-width: 100% !important;
      min-width: 0 !important;
      height: auto !important;
      min-height: 0 !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
      word-break: break-word !important;
    }

    html.lnf-mobile-r3 .lnf-book-info-r3 h1,
    html.lnf-mobile-r3 .lnf-book-info-r3 h2,
    html.lnf-mobile-r3 .lnf-book-info-r3 h3,
    html.lnf-mobile-r3 .lnf-book-info-r3 p,
    html.lnf-mobile-r3 .lnf-book-info-r3 div,
    html.lnf-mobile-r3 .lnf-book-info-r3 span,
    html.lnf-mobile-r3 .lnf-book-info-r3 a {
      max-width: 100% !important;
      min-width: 0 !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
      word-break: break-word !important;
    }

    html.lnf-mobile-r3 .lnf-book-extra-r3 {
      grid-column: 1 / -1 !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      height: auto !important;
      min-height: 0 !important;
    }

    html.lnf-mobile-r3 .lnf-book-actions-r3,
    html.lnf-mobile-r3 .lnf-book-tags-r3 {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      gap: 8px !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      height: auto !important;
      overflow: visible !important;
      white-space: normal !important;
    }

    html.lnf-mobile-r3 .lnf-toc-tabs-r3 {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      align-content: flex-start !important;
      gap: 8px !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      height: auto !important;
      min-height: 0 !important;
      overflow: visible !important;
      overflow-x: visible !important;
      white-space: normal !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-toc-tabs-r3 > * {
      flex: 0 0 auto !important;
      width: auto !important;
      max-width: calc(100vw - 48px) !important;
      min-width: 0 !important;
      margin: 0 !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
      transform: none !important;
    }

    html.lnf-mobile-r3 .lnf-chapter-link-r3 {
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

    @media (max-width: 380px) {
      html.lnf-mobile-r3 .lnf-book-hero-r3 {
        grid-template-columns: 100px minmax(0, 1fr) !important;
        gap: 10px 12px !important;
      }
      html.lnf-mobile-r3 .lnf-book-cover-col-r3,
      html.lnf-mobile-r3 img.lnf-book-cover-r3 {
        width: 100px !important;
        max-width: 100px !important;
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

  function directChildUnder(ancestor, node) {
    if (!ancestor || !node || !ancestor.contains(node)) return null;
    let cur = node;
    while (cur && cur.parentElement !== ancestor) cur = cur.parentElement;
    return cur && cur.parentElement === ancestor ? cur : null;
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

  function smallestExact(text, selectors = 'a,button,span,div,h1,h2,h3,h4,strong,b') {
    const wanted = compact(text);
    return qsa(selectors)
      .filter(visible)
      .filter(el => compact(el.textContent) === wanted)
      .sort((a, b) => a.children.length - b.children.length || a.textContent.length - b.textContent.length)[0] || null;
  }

  function markWrapGroup(labels, minCount, className, maxTextLen) {
    const wanted = new Set(labels);
    const nodes = qsa('a,button,span')
      .filter(visible)
      .filter(el => wanted.has(compact(el.textContent)));
    if (nodes.length < minCount) return null;

    const map = new Map();
    nodes.forEach(node => {
      let p = node.parentElement;
      for (let depth = 0; depth < 5 && p && p !== document.body; depth++, p = p.parentElement) {
        if (!map.has(p)) map.set(p, new Set());
        map.get(p).add(compact(node.textContent));
      }
    });

    const candidates = [...map.entries()]
      .filter(([, set]) => set.size >= minCount)
      .map(([el, set]) => ({
        el,
        count: set.size,
        textLen: compact(el.textContent).length,
        depth: (() => { let d = 0, p = el; while (p && p !== document.body) { d++; p = p.parentElement; } return d; })()
      }))
      .filter(x => x.textLen <= maxTextLen)
      .sort((a, b) => b.count - a.count || b.depth - a.depth || a.textLen - b.textLen);

    const best = candidates[0];
    if (!best) return null;
    best.el.classList.add(className);
    return best.el;
  }

  function fixTopNavs() {
    markWrapGroup(['消息', '动态', '历史', '收藏', '旧版', '发帖', '登入/注册'], 4, 'lnf-nav-r3', 100);
    markWrapGroup(['动态', '排行', '热度', '新书', '轻小说', '原创', '同人', 'EPUB'], 5, 'lnf-nav-r3', 120);
  }

  function fixBookHero() {
    const tocHeading = smallestExact('目录', 'h1,h2,h3,h4,strong,b,div,span');
    if (!tocHeading) return;
    const tocTop = tocHeading.getBoundingClientRect().top + window.scrollY;

    const coverCandidates = qsa('img').filter(img => {
      if (!visible(img)) return false;
      const r = img.getBoundingClientRect();
      const top = r.top + window.scrollY;
      return top < tocTop && r.height >= 150 && r.width >= 80 && r.height > r.width * 1.05;
    });
    const cover = coverCandidates[coverCandidates.length - 1];
    if (!cover) return;

    const shelf = smallestExact('加入书架');
    if (!shelf) return;

    let hero = lowestCommonAncestor(cover, shelf);
    if (!hero || hero === document.body) return;

    let coverCol = directChildUnder(hero, cover);
    let infoCol = directChildUnder(hero, shelf);
    let guard = 0;
    while ((!coverCol || !infoCol || coverCol === infoCol) && hero.parentElement && hero.parentElement !== document.body && guard++ < 4) {
      hero = hero.parentElement;
      coverCol = directChildUnder(hero, cover);
      infoCol = directChildUnder(hero, shelf);
    }
    if (!coverCol || !infoCol || coverCol === infoCol) return;

    hero.classList.add('lnf-book-hero-r3');
    cover.classList.add('lnf-book-cover-r3');
    coverCol.classList.add('lnf-book-cover-col-r3');
    infoCol.classList.add('lnf-book-info-r3');

    Array.from(hero.children).forEach(child => {
      if (child !== coverCol && child !== infoCol) child.classList.add('lnf-book-extra-r3');
    });

    const report = smallestExact('举报');
    if (report && infoCol.contains(report)) {
      const actionBox = lowestCommonAncestor(shelf, report);
      if (actionBox && actionBox !== infoCol) actionBox.classList.add('lnf-book-actions-r3');
    }

    const tagWords = ['搞笑', '悬疑', '青春', '百合', '校园', '后宫', '恋爱'];
    const tagNodes = qsa('a,span,div', infoCol)
      .filter(visible)
      .filter(el => tagWords.includes(compact(el.textContent)));
    if (tagNodes.length >= 2) {
      let box = tagNodes[0].parentElement;
      while (box && box !== infoCol) {
        const n = tagNodes.filter(t => box.contains(t)).length;
        if (n >= 2) break;
        box = box.parentElement;
      }
      if (box) box.classList.add('lnf-book-tags-r3');
    }
  }

  function fixToc() {
    const tocHeading = smallestExact('目录', 'h1,h2,h3,h4,strong,b,div,span');
    if (!tocHeading) return;

    let toc = tocHeading.parentElement;
    while (toc && toc !== document.body) {
      const links = qsa('a', toc).filter(visible);
      if (links.length >= 4 && compact(toc.textContent).length > 30) break;
      toc = toc.parentElement;
    }
    if (!toc || toc === document.body) return;

    const volumeRe = /^(?:\d+\s*卷(?:.*)?|\d+\s*巻(?:.*)?|.*卷特典.*)$/i;
    const nodes = qsa('a,button,span,div', toc)
      .filter(visible)
      .filter(el => {
        const t = compact(el.textContent);
        return t.length > 0 && t.length < 24 && volumeRe.test(t);
      });

    const map = new Map();
    nodes.forEach(node => {
      let p = node.parentElement;
      for (let depth = 0; depth < 4 && p && p !== toc.parentElement; depth++, p = p.parentElement) {
        if (!map.has(p)) map.set(p, new Set());
        map.get(p).add(compact(node.textContent));
      }
    });

    const best = [...map.entries()]
      .filter(([, set]) => set.size >= 2)
      .map(([el, set]) => ({ el, count: set.size, len: compact(el.textContent).length }))
      .filter(x => x.len < 180)
      .sort((a, b) => b.count - a.count || a.len - b.len)[0];
    if (best) best.el.classList.add('lnf-toc-tabs-r3');

    qsa('a', toc).forEach(a => {
      const t = compact(a.textContent);
      if (t.length >= 4 && !volumeRe.test(t)) a.classList.add('lnf-chapter-link-r3');
    });
  }

  let running = false;
  function run() {
    if (running) return;
    running = true;
    try {
      fixTopNavs();
      fixBookHero();
      fixToc();
      requestAnimationFrame(() => {
        const scrolling = document.scrollingElement || document.documentElement;
        if (scrolling) scrolling.scrollLeft = 0;
      });
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
