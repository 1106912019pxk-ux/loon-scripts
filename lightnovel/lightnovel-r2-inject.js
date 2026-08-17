/**
 * lightnovel.fun Mobile R2 response injector.
 * Only injects the front-end layout script into GET HTML responses.
 * POST requests (login/search/posting/etc.) are left untouched.
 */
const INJECT = '<script id="lnf-mobile-r2-loader" src="https://cdn.jsdelivr.net/gh/1106912019pxk-ux/loon-scripts@725868fe4a425d0e5f501049135fea3370e86571/lightnovel/lightnovel-mobile-r1.js"></script>';

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
      console.log('[LNF Mobile R2] HTML body not exposed as String; pass through');
      $done({});
    } else if (body.includes('id="lnf-mobile-r2-loader"') || body.includes('id="lnf-mobile-r1-loader"')) {
      $done({});
    } else {
      const low = body.toLowerCase();
      let pos = low.lastIndexOf('</body>');
      if (pos < 0) pos = low.lastIndexOf('</html>');

      if (pos < 0) {
        console.log('[LNF Mobile R2] no closing body/html; pass through');
        $done({});
      } else {
        const modified = body.slice(0, pos) + INJECT + body.slice(pos);
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
  console.log('[LNF Mobile R2] ' + e);
  $done({});
}
