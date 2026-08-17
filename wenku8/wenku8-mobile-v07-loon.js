/**
 * Wenku8 Mobile v0.7 - Pure Remote Loon Injector
 * The actual v0.7 userscript is stored remotely as a gzip+base64 payload.
 */
const INJECT = '<script id="w8m-loon-v07-remote">(function(){\nif(window.__W8M_LOON_V07_REMOTE__)return;\nwindow.__W8M_LOON_V07_REMOTE__=1;\nfetch(\'https://raw.githubusercontent.com/1106912019pxk-ux/loon-scripts/main/wenku8/wenku8-mobile-v07.payload.txt\',{cache:\'no-store\'})\n.then(function(r){if(!r.ok)throw new Error(\'payload \'+r.status);return r.text();})\n.then(function(b64){\n  b64=b64.trim();\n  var bin=atob(b64),u=new Uint8Array(bin.length);\n  for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);\n  if(typeof DecompressionStream===\'undefined\')throw new Error(\'DecompressionStream unsupported\');\n  var ds=new DecompressionStream(\'gzip\');\n  return new Response(new Blob([u]).stream().pipeThrough(ds)).text();\n})\n.then(function(js){(0,eval)(js);})\n.catch(function(e){console.error(\'[W8M remote]\',e);});\n})();</script>';

function asciiBytes(text) {
  const out = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) out[i] = text.charCodeAt(i) & 255;
  return out;
}

function lowerByte(b) {
  return b >= 65 && b <= 90 ? b + 32 : b;
}

function findAsciiIgnoreCase(bytes, text) {
  const needle = asciiBytes(text.toLowerCase());
  outer:
  for (let i = bytes.length - needle.length; i >= 0; i--) {
    for (let j = 0; j < needle.length; j++) {
      if (lowerByte(bytes[i+j]) !== needle[j]) continue outer;
    }
    return i;
  }
  return -1;
}

function insertBytes(src, add, pos) {
  const out = new Uint8Array(src.length + add.length);
  out.set(src.subarray(0,pos),0);
  out.set(add,pos);
  out.set(src.subarray(pos),pos+add.length);
  return out;
}

function deleteHeader(headers, name) {
  const n = name.toLowerCase();
  for (const k of Object.keys(headers || {})) {
    if (k.toLowerCase() === n) delete headers[k];
  }
}

try {
  const url = ($request && $request.url) || '';
  if (!/^https?:\/\/(?:www\.)?wenku8\.net\//i.test(url) ||
      /^https?:\/\/(?:www\.)?wenku8\.net\/wap(?:\/|$)/i.test(url)) {
    $done({});
  } else {
    const headers = Object.assign({}, ($response && $response.headers) || {});
    const body = $response && $response.body;
    let modified = null;

    if (body instanceof Uint8Array) {
      if (findAsciiIgnoreCase(body,'id="w8m-loon-v07-remote"') >= 0) {
        $done({});
      } else {
        let pos = findAsciiIgnoreCase(body,'</body>');
        if (pos < 0) pos = findAsciiIgnoreCase(body,'</html>');
        if (pos >= 0) modified = insertBytes(body, asciiBytes(INJECT), pos);
      }
    } else if (typeof body === 'string') {
      if (body.includes('id="w8m-loon-v07-remote"')) {
        $done({});
      } else {
        const low = body.toLowerCase();
        let pos = low.lastIndexOf('</body>');
        if (pos < 0) pos = low.lastIndexOf('</html>');
        if (pos >= 0) modified = body.slice(0,pos) + INJECT + body.slice(pos);
      }
    }

    if (!modified) {
      $done({});
    } else {
      deleteHeader(headers,'content-length');
      deleteHeader(headers,'content-encoding');
      deleteHeader(headers,'content-security-policy');
      deleteHeader(headers,'content-security-policy-report-only');
      $done({status:($response&&$response.status)||200,headers:headers,body:modified});
    }
  }
} catch(e) {
  console.log('[W8M remote injector] '+e);
  $done({});
}
