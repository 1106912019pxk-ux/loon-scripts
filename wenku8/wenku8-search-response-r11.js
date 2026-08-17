/**
 * Wenku8 search-result response injector for Remote R11 Experimental.
 * /so.php request is kept intact except Accept-Encoding:gzip.
 * If the response is gzip, decode it with Loon $utils.ungzip, then inject the
 * same stable Remote R8 browser loader used by the working non-search pages.
 */
const INJECT = '<script id="w8m-loon-v07-remote" src="https://cdn.jsdelivr.net/gh/1106912019pxk-ux/loon-scripts@0963019a240d4752326a050b6e2293a271e517ad/wenku8/wenku8-mobile-v07-browser-loader.js"></script>';

function asciiBytes(text) {
  const out = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) out[i] = text.charCodeAt(i) & 255;
  return out;
}

function lowerByte(b) {
  return (b >= 65 && b <= 90) ? b + 32 : b;
}

function findAsciiIgnoreCase(bytes, text) {
  const needle = asciiBytes(text.toLowerCase());
  outer:
  for (let i = bytes.length - needle.length; i >= 0; i--) {
    for (let j = 0; j < needle.length; j++) {
      if (lowerByte(bytes[i + j]) !== needle[j]) continue outer;
    }
    return i;
  }
  return -1;
}

function insertBytes(src, add, pos) {
  const out = new Uint8Array(src.length + add.length);
  out.set(src.subarray(0, pos), 0);
  out.set(add, pos);
  out.set(src.subarray(pos), pos + add.length);
  return out;
}

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
  const headers = Object.assign({}, ($response && $response.headers) || {});
  const body = $response && $response.body;
  let modified = null;

  if (body instanceof Uint8Array) {
    let bytes = body;
    const enc = getHeader(headers, 'content-encoding').toLowerCase();
    const looksGzip = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;

    if (enc.includes('gzip') || looksGzip) {
      try {
        bytes = $utils.ungzip(bytes);
        deleteHeader(headers, 'content-encoding');
      } catch (e) {
        console.log('[W8M search R11] ungzip failed: ' + e);
        $done({});
      }
    } else if (enc && !enc.includes('identity')) {
      console.log('[W8M search R11] unsupported encoding: ' + enc);
      $done({});
    }

    if (findAsciiIgnoreCase(bytes, 'id="w8m-loon-v07-remote"') >= 0) {
      $done({});
    } else {
      let pos = findAsciiIgnoreCase(bytes, '</body>');
      if (pos < 0) pos = findAsciiIgnoreCase(bytes, '</html>');
      if (pos >= 0) modified = insertBytes(bytes, asciiBytes(INJECT), pos);
    }
  } else if (typeof body === 'string') {
    if (body.includes('id="w8m-loon-v07-remote"')) {
      $done({});
    } else {
      const low = body.toLowerCase();
      let pos = low.lastIndexOf('</body>');
      if (pos < 0) pos = low.lastIndexOf('</html>');
      if (pos >= 0) modified = body.slice(0, pos) + INJECT + body.slice(pos);
    }
  }

  if (!modified) {
    $done({});
  } else {
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
} catch (e) {
  console.log('[W8M search R11] ' + e);
  $done({});
}
