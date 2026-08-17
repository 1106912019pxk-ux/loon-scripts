(async function(){
  if (window.__W8M_BROWSER_V07__) return;
  window.__W8M_BROWSER_V07__ = true;

  function fail(err){
    console.error('[Wenku8 Mobile v0.7 browser loader]', err);
    const badge = document.createElement('div');
    badge.textContent = 'Wenku8 Mobile 加载失败：' + (err && err.message ? err.message : String(err));
    badge.style.cssText = 'position:fixed;z-index:2147483647;left:12px;right:12px;top:12px;padding:10px 12px;background:#b42318;color:white;border-radius:10px;font:14px -apple-system,sans-serif;text-align:center;white-space:normal;word-break:break-word';
    document.documentElement.appendChild(badge);
  }

  function loadScript(src){
    return new Promise((resolve,reject)=>{
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve(s);
      s.onerror = () => reject(new Error('外部脚本加载失败: ' + src));
      (document.head || document.documentElement).appendChild(s);
    });
  }

  try {
    if (!window.fflate || typeof window.fflate.gunzipSync !== 'function') {
      await loadScript('https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js');
    }
    if (!window.fflate || typeof window.fflate.gunzipSync !== 'function') {
      throw new Error('fflate 未加载');
    }

    const payloadUrl = 'https://cdn.jsdelivr.net/gh/1106912019pxk-ux/loon-scripts@main/wenku8/wenku8-mobile-v07.payload.txt?rev=3';
    const r = await fetch(payloadUrl, { cache: 'no-store', mode: 'cors' });
    if (!r.ok) throw new Error('payload HTTP ' + r.status);

    const b64 = (await r.text()).trim();
    const bin = atob(b64);
    const gz = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) gz[i] = bin.charCodeAt(i);

    const raw = window.fflate.gunzipSync(gz);
    const js = new TextDecoder('utf-8').decode(raw);
    if (!js || js.length < 1000) throw new Error('v0.7 解压结果异常');

    // Execute as a Blob-backed external script instead of inline text/eval.
    const blob = new Blob([js], { type: 'text/javascript;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    try {
      await loadScript(blobUrl);
    } finally {
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    }

    setTimeout(() => {
      if (!document.getElementById('w8m-topbar') && !document.getElementById('w8m-reader-shell')) {
        fail(new Error('v0.7 已执行但未生成移动界面'));
      }
    }, 700);
  } catch (e) {
    fail(e);
  }
})();
