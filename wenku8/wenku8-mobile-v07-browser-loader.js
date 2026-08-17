(async function(){
  if (window.__W8M_BROWSER_V07__) return;
  window.__W8M_BROWSER_V07__ = true;
  try {
    const url = 'https://cdn.jsdelivr.net/gh/1106912019pxk-ux/loon-scripts@main/wenku8/wenku8-mobile-v07.payload.txt?rev=1';
    const r = await fetch(url, { cache: 'no-store', mode: 'cors' });
    if (!r.ok) throw new Error('payload HTTP ' + r.status);
    const b64 = (await r.text()).trim();
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    if (typeof DecompressionStream === 'undefined') {
      throw new Error('DecompressionStream unavailable');
    }
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const js = await new Response(stream).text();
    (0, eval)(js);
  } catch (e) {
    console.error('[Wenku8 Mobile v0.7 browser loader]', e);
    const badge = document.createElement('div');
    badge.textContent = 'Wenku8 Mobile 加载失败';
    badge.style.cssText = 'position:fixed;z-index:2147483647;left:12px;right:12px;top:12px;padding:10px 12px;background:#b42318;color:white;border-radius:10px;font:14px -apple-system,sans-serif;text-align:center';
    document.documentElement.appendChild(badge);
    setTimeout(()=>badge.remove(),5000);
  }
})();
