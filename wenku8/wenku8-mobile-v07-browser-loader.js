(async function(){
  if (window.__W8M_BROWSER_V07__) return;
  window.__W8M_BROWSER_V07__ = true;

  function loadExternalScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve(s);
      s.onerror = () => reject(new Error('脚本加载失败: ' + src));
      (document.head || document.documentElement).appendChild(s);
    });
  }

  function showError(err) {
    console.error('[Wenku8 Mobile v0.7 browser loader]', err);
    const badge = document.createElement('div');
    badge.textContent = 'Wenku8 Mobile 加载失败：' + (err && err.message ? err.message : String(err));
    badge.style.cssText = 'position:fixed;z-index:2147483647;left:12px;right:12px;top:12px;padding:10px 12px;background:#b42318;color:white;border-radius:10px;font:13px -apple-system,sans-serif;text-align:center;white-space:normal;word-break:break-all';
    document.documentElement.appendChild(badge);
  }

  try {
    if (!window.fflate || typeof window.fflate.gunzipSync !== 'function') {
      await loadExternalScript('https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js');
    }
    if (!window.fflate || typeof window.fflate.gunzipSync !== 'function') {
      throw new Error('fflate 未加载');
    }

    const payloadUrl = 'https://cdn.jsdelivr.net/gh/1106912019pxk-ux/loon-scripts@main/wenku8/wenku8-mobile-v07.payload.txt?rev=2';
    const r = await fetch(payloadUrl, { cache: 'no-store', mode: 'cors' });
    if (!r.ok) throw new Error('payload HTTP ' + r.status);

    const b64 = (await r.text()).trim();
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

    const jsBytes = window.fflate.gunzipSync(bytes);
    const js = new TextDecoder('utf-8').decode(jsBytes);
    if (!js || js.length < 1000) throw new Error('v0.7 解压结果异常');

    const runner = document.createElement('script');
    runner.id = 'w8m-v07-runtime';
    runner.textContent = js;
    (document.body || document.documentElement).appendChild(runner);

    setTimeout(() => {
      if (!document.getElementById('w8m-topbar') && !document.getElementById('w8m-reader-shell')) {
        showError(new Error('v0.7 已执行但未生成移动界面'));
      }
    }, 500);
  } catch (e) {
    showError(e);
  }
})();
