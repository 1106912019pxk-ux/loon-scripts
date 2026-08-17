/**
 * lightnovel.fun Mobile R3 response injector.
 * Only injects the conservative R3 layout script into GET HTML responses.
 * POST requests (search/login/posting/etc.) are left untouched.
 */
const INJECT = '<script id="lnf-mobile-r3-loader" src="https://cdn.jsdelivr.net/gh/1106912019pxk-ux/loon-scripts@cf8c93f5ddb44cc1c9ff37cd6701bf4cffcd2877/lightnovel/lightnovel-mobile-r3.js"></script>';

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
      console.log('[LNF Mobile R3] HTML body not exposed as String; pass through');
      $done({});
    } else if (body.includes('id="lnf-mobile-r3-loader"')) {
      $done({});
    } else {
      const low = body.toLowerCase();
      let pos = low.lastIndexOf('</body>');
      if (pos < 0) pos = low.lastIndexOf('</html>');

      if (pos < 0) {
        console.log('[LNF Mobile R3] no closing body/html; pass through');
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
  console.log('[LNF Mobile R3] ' + e);
  $done({});
}
