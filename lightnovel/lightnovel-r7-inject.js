/**
 * lightnovel.fun Mobile R7 response injector.
 * Stable R3 base + R7 patch. Only GET HTML is touched.
 * Detail pages get a tiny pre-paint opacity guard so the cover does not visibly jump/resize.
 */
const INJECT = '<script id="lnf-mobile-r7-base" src="https://cdn.jsdelivr.net/gh/1106912019pxk-ux/loon-scripts@cf8c93f5ddb44cc1c9ff37cd6701bf4cffcd2877/lightnovel/lightnovel-mobile-r3.js"></script><script id="lnf-mobile-r7-patch" src="https://cdn.jsdelivr.net/gh/1106912019pxk-ux/loon-scripts@842431e484c970f84817a0e7127dbfaefa37466e/lightnovel/lightnovel-mobile-r7-patch.js"></script>';

const DETAIL_PREP = '<style id="lnf-r7-prehide">body{opacity:0!important}</style><script id="lnf-r7-prehide-fallback">setTimeout(function(){var s=document.getElementById("lnf-r7-prehide");if(s)s.remove()},1800)</script>';

function getHeader(headers, name) {
  const wanted = name.toLowerCase();
  for (const key of Object.keys(headers || {})) {
    if (key.toLowerCase() === wanted) return String(headers[key] || '');
  }
  return '';
}

function deleteHeader(headers, name) {
  const wanted = name.toLowerCase();
  for (const key of Object.keys(headers || {})) {
    if (key.toLowerCase() === wanted) delete headers[key];
  }
}

try {
  const method = String(($request && $request.method) || 'GET').toUpperCase();
  const url = String(($request && $request.url) || '');

  if (method !== 'GET' || !/^https:\/\/(?:www\.)?lightnovel\.fun(?:\/|$)/i.test(url)) {
    $done({});
  } else {
    const headers = Object.assign({}, ($response && $response.headers) || {});
    const type = getHeader(headers, 'content-type');
    const body = $response && $response.body;

    if (type && !/text\/html|application\/xhtml\+xml/i.test(type)) {
      $done({});
    } else if (typeof body !== 'string' || !body) {
      console.log('[LNF Mobile R7] HTML body not exposed as String; pass through');
      $done({});
    } else if (body.includes('id="lnf-mobile-r7-base"') || body.includes('id="lnf-mobile-r7-patch"')) {
      $done({});
    } else {
      let modified = body;
      const low = modified.toLowerCase();

      // Only detail pages need the no-jump pre-paint guard.
      const isDetail = modified.includes('加入书架') && modified.includes('目录');
      if (isDetail && !modified.includes('id="lnf-r7-prehide"')) {
        let headPos = low.lastIndexOf('</head>');
        if (headPos >= 0) modified = modified.slice(0, headPos) + DETAIL_PREP + modified.slice(headPos);
      }

      const low2 = modified.toLowerCase();
      let pos = low2.lastIndexOf('</body>');
      if (pos < 0) pos = low2.lastIndexOf('</html>');

      if (pos < 0) {
        console.log('[LNF Mobile R7] no closing body/html; pass through');
        $done({});
      } else {
        modified = modified.slice(0, pos) + INJECT + modified.slice(pos);
        deleteHeader(headers, 'content-length');
        deleteHeader(headers, 'content-encoding');
        deleteHeader(headers, 'content-security-policy');
        deleteHeader(headers, 'content-security-policy-report-only');
        $done({
          status: ($response && $response.status) || 200,
          headers,
          body: modified
        });
      }
    }
  }
} catch (e) {
  console.log('[LNF Mobile R7] ' + e);
  $done({});
}
