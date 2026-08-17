(function(){
  'use strict';
  if (location.pathname !== '/so.php') return;
  if (window.__W8M_SEARCH_LAYOUT_R14__) return;
  window.__W8M_SEARCH_LAYOUT_R14__ = true;

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const norm = v => String(v || '').replace(/\s+/g, ' ').trim();

  function installStyle(){
    if ($('#w8m-search-r14-style')) return;
    const style = document.createElement('style');
    style.id = 'w8m-search-r14-style';
    style.textContent = `
      html.w8m-search-r14,
      html.w8m-search-r14 body {
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }
      html.w8m-search-r14 body { box-sizing: border-box !important; }
      html.w8m-search-r14 .w8m-search-wide {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      html.w8m-search-r14 table.w8m-search-wide {
        table-layout: auto !important;
      }
      html.w8m-search-r14 table.w8m-search-wide td,
      html.w8m-search-r14 table.w8m-search-wide th {
        min-width: 0 !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      .w8m-search-pager-original {
        display: none !important;
      }
      #w8m-search-pager-r14 {
        width: min(100%, 720px) !important;
        max-width: calc(100vw - 24px) !important;
        margin: 16px auto 20px !important;
        padding: 10px !important;
        box-sizing: border-box !important;
        border: 1px solid rgba(120,130,150,.22) !important;
        border-radius: 15px !important;
        background: rgba(255,255,255,.96) !important;
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        clear: both !important;
        overflow: hidden !important;
      }
      #w8m-search-pager-r14 a,
      #w8m-search-pager-r14 span {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-width: 42px !important;
        min-height: 42px !important;
        padding: 8px 10px !important;
        box-sizing: border-box !important;
        border: 1px solid rgba(120,130,150,.22) !important;
        border-radius: 11px !important;
        background: #f3f6fb !important;
        color: #2457a6 !important;
        font: 650 15px/1.1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif !important;
        text-decoration: none !important;
        white-space: nowrap !important;
      }
      #w8m-search-pager-r14 .w8m-search-page-status {
        min-width: 112px !important;
        color: #222 !important;
        background: #fff !important;
        font-weight: 750 !important;
      }
      #w8m-search-pager-r14 .current {
        background: #2f67b9 !important;
        color: #fff !important;
        border-color: #2f67b9 !important;
      }
      @media (prefers-color-scheme: dark) {
        #w8m-search-pager-r14 { background: rgba(30,32,36,.96) !important; }
        #w8m-search-pager-r14 a,
        #w8m-search-pager-r14 span { background: #292d35 !important; color: #9fc2ff !important; }
        #w8m-search-pager-r14 .w8m-search-page-status { background: #20242a !important; color: #f4f4f4 !important; }
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function markWideElements(){
    const vw = Math.max(320, window.innerWidth || document.documentElement.clientWidth || 320);
    $$('table, form, div').forEach(el => {
      if (el.closest('#w8m-topbar,#w8m-menu,#w8m-search-pager-r14')) return;
      const r = el.getBoundingClientRect();
      const tooWide = r.width > vw + 8 || el.scrollWidth > vw + 12;
      if (!tooWide) return;
      el.classList.add('w8m-search-wide');
      el.removeAttribute('width');
      el.style.removeProperty('width');
      el.style.removeProperty('min-width');
      el.style.setProperty('max-width','100%','important');
      if (el.tagName === 'TABLE') {
        $$('[width]', el).forEach(node => {
          if (node.tagName !== 'IMG') node.removeAttribute('width');
        });
      }
    });
  }

  function findPagerCounter(){
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        const text = String(node.nodeValue || '').trim();
        if (!/^\d+\s*\/\s*\d+$/.test(text)) return NodeFilter.FILTER_REJECT;
        const p = node.parentElement;
        if (!p || p.closest('#w8m-topbar,#w8m-menu,#w8m-search-pager-r14')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    return walker.nextNode();
  }

  function pagerContainer(counterNode){
    let el = counterNode && counterNode.parentElement;
    let best = el;
    for (let i=0; i<7 && el && el !== document.body; i++, el=el.parentElement){
      const text = norm(el.textContent);
      const links = $$('a[href]', el);
      if (/\d+\s*\/\s*\d+/.test(text) && links.length >= 1 && text.length < 350) {
        best = el;
        if (['TD','TH','DIV','CENTER','P','NAV'].includes(el.tagName)) break;
      }
    }
    return best;
  }

  function pageNum(a){
    const t = norm(a.textContent);
    return /^\d+$/.test(t) ? Number(t) : null;
  }

  function rebuildPager(){
    if ($('#w8m-search-pager-r14')) return;
    const counter = findPagerCounter();
    if (!counter) return;
    const m = String(counter.nodeValue || '').trim().match(/^(\d+)\s*\/\s*(\d+)$/);
    if (!m) return;
    const current = Number(m[1]), total = Number(m[2]);
    const source = pagerContainer(counter);
    if (!source) return;

    const links = $$('a[href]', source);
    const numbered = new Map();
    links.forEach(a => {
      const n = pageNum(a);
      if (Number.isInteger(n) && n >= 1 && n <= total && !numbered.has(n)) numbered.set(n, a);
    });

    const textOf = a => norm(a.textContent);
    const prev = links.find(a => /^(?:上一页|上页|<|<<|‹|«)$/.test(textOf(a))) || numbered.get(current - 1) || null;
    const next = links.find(a => /^(?:下一页|下页|>|>>|›|»)$/.test(textOf(a))) || numbered.get(current + 1) || null;

    const nav = document.createElement('nav');
    nav.id = 'w8m-search-pager-r14';
    nav.setAttribute('aria-label','搜索结果分页');

    if (total <= 1) {
      const status = document.createElement('span');
      status.className = 'w8m-search-page-status';
      status.textContent = `第 ${current} / ${total} 页`;
      nav.appendChild(status);
    } else {
      if (prev && prev.href) {
        const a = document.createElement('a');
        a.href = prev.href;
        a.textContent = '上一页';
        nav.appendChild(a);
      }

      const status = document.createElement('span');
      status.className = 'w8m-search-page-status';
      status.textContent = `第 ${current} / ${total} 页`;
      nav.appendChild(status);

      const wanted = new Set([1,total,current-2,current-1,current,current+1,current+2]);
      [...wanted].filter(n => n>=1 && n<=total).sort((a,b)=>a-b).forEach(n => {
        if (n === current) {
          const s = document.createElement('span');
          s.className = 'current';
          s.textContent = String(n);
          nav.appendChild(s);
        } else if (numbered.get(n)?.href) {
          const a = document.createElement('a');
          a.href = numbered.get(n).href;
          a.textContent = String(n);
          nav.appendChild(a);
        }
      });

      if (next && next.href) {
        const a = document.createElement('a');
        a.href = next.href;
        a.textContent = '下一页';
        nav.appendChild(a);
      }
    }

    const anchor = source.closest('table') || source;
    if (anchor.parentNode) anchor.parentNode.insertBefore(nav, anchor);
    source.classList.add('w8m-search-pager-original');

    let p = source.parentElement;
    for (let i=0; i<5 && p && p!==document.body; i++,p=p.parentElement){
      p.style.removeProperty('width');
      p.style.removeProperty('min-width');
      p.style.setProperty('max-width','100%','important');
    }
  }

  function apply(){
    installStyle();
    document.documentElement.classList.add('w8m-search-r14');
    markWideElements();
    rebuildPager();
    const scroller = document.scrollingElement || document.documentElement;
    if (scroller) scroller.scrollLeft = 0;
  }

  [0,120,350,800,1500].forEach(ms => setTimeout(apply, ms));
})();
