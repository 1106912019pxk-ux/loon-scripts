/**
 * Wenku8 search result response adapter - Remote R12 Experimental
 * IMPORTANT: /so.php request is left completely untouched.
 * This response script only adapts the returned HTML if Loon exposes it as a String.
 * If Loon cannot decode the response (for example zstd remains binary), it safely does nothing.
 */
const INJECT = '<script id="w8m-loon-v07-remote" src="https://cdn.jsdelivr.net/gh/1106912019pxk-ux/loon-scripts@0963019a240d4752326a050b6e2293a271e517ad/wenku8/wenku8-mobile-v07-browser-loader.js"></script>';

function deleteHeader(headers, name) {
  const wanted = name.toLowerCase();
  for (const key of Object.keys(headers || {})) {
    if (key.toLowerCase() === wanted) delete headers[key];
  }
}

try {
  const body = $response && $response.body;
  const headers = Object.assign({}, ($response && $response.headers) || {});

  // R12 is intentionally fail-open: never break search merely to style results.
  if (typeof body !== 'string' || !body) {
    console.log('[W8M R12 search] response body is not String; keep original search result');
    $done({});
  } else if (body.includes('id="w8m-loon-v07-remote"')) {
    $done({});
  } else {
    const low = body.toLowerCase();
    let pos = low.lastIndexOf('</body>');
    if (pos < 0) pos = low.lastIndexOf('</html>');

    if (pos < 0) {
      console.log('[W8M R12 search] no closing body/html; keep original');
      $done({});
    } else {
      const modified = body.slice(0, pos) + INJECT + body.slice(pos);
      deleteHeader(headers, 'content-length');
      // If Loon gave us a String, the body is already decoded for script use.
      // Returning the modified String must not retain the old compression marker.
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
} catch (e) {
  console.log('[W8M R12 search] ' + e);
  $done({});
}
