(async function(){
  if (window.__W8M_BROWSER_V07__) return;
  window.__W8M_BROWSER_V07__ = true;

  function fail(err){
    console.error('[Wenku8 Mobile v0.7 browser loader]', err);
    const badge = document.createElement('div');
    badge.textContent = 'Wenku8 Mobile 加载失败：' + (err && err.message ? err.message : String(err));
    badge.style.cssText = 'position:fixed;z-index:2147483647;left:12px;right:12px;top:12px;padding:10px 12px;background:#b42318;color:white;border-radius:10px;font:13px -apple-system,sans-serif;text-align:center;white-space:normal;word-break:break-word';
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

    // IMPORTANT: pin the payload to the exact commit that contains the clean
    // gzip/base64 generated from the locally verified Wenku8 Mobile v0.7 file.
    // Do not use @main here: jsDelivr caches mutable branch aliases.
    const payloadUrl = 'https://cdn.jsdelivr.net/gh/1106912019pxk-ux/loon-scripts@d87db28ac339ce9080b68d63bbfb6ed059d3ff2d/wenku8/wenku8-mobile-v07.payload.txt';
    const r = await fetch(payloadUrl, { cache: 'no-store', mode: 'cors' });
    if (!r.ok) throw new Error('payload HTTP ' + r.status);

    const sourceText = await r.text();
    let b64 = sourceText.replace(/[^A-Za-z0-9+/=]/g, '');
    while (b64.length % 4) b64 += '=';
    if (b64.length < 100) throw new Error('payload Base64 内容过短: ' + b64.length);

    let bin;
    try {
      bin = atob(b64);
    } catch (e) {
      throw new Error('Base64 解码失败，长度=' + b64.length + '：' + (e && e.message ? e.message : e));
    }

    const gz = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) gz[i] = bin.charCodeAt(i);
    if (gz.length < 2 || gz[0] !== 0x1f || gz[1] !== 0x8b) {
      throw new Error('payload 不是有效 gzip，magic=' + (gz[0]||0).toString(16) + ',' + (gz[1]||0).toString(16));
    }

    const raw = window.fflate.gunzipSync(gz);
    const js = new TextDecoder('utf-8').decode(raw);
    if (!js || js.length < 1000) throw new Error('v0.7 解压结果异常，长度=' + js.length);

    let runtimeError = '';
    const onError = (ev) => {
      if (ev && ev.message) runtimeError = ev.message;
      else if (ev && ev.error) runtimeError = String(ev.error);
    };
    const onReject = (ev) => {
      if (ev && ev.reason) runtimeError = 'Promise: ' + (ev.reason.message || String(ev.reason));
    };
    window.addEventListener('error', onError, true);
    window.addEventListener('unhandledrejection', onReject, true);

    const blob = new Blob([js], { type: 'text/javascript;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    try {
      await loadScript(blobUrl);
      await new Promise(r => setTimeout(r, 120));
    } finally {
      window.removeEventListener('error', onError, true);
      window.removeEventListener('unhandledrejection', onReject, true);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    }

    setTimeout(() => {
      if (!document.getElementById('w8m-topbar') && !document.getElementById('w8m-reader-shell')) {
        if (runtimeError) {
          fail(new Error('v0.7 运行时异常：' + runtimeError));
        } else {
          const topSelf = window.top === window.self;
          const uaMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          fail(new Error('v0.7 未生成界面；topSelf=' + topSelf + '，width=' + window.innerWidth + '，uaMobile=' + uaMobile + '，path=' + location.pathname));
        }
      }
    }, 700);
  } catch (e) {
    fail(e);
  }
})();
