// Wenku8 search helper: preserve POST/body/cookies, only prefer gzip so the
// response can be safely decoded by Loon before mobile UI injection.
try {
  const headers = Object.assign({}, ($request && $request.headers) || {});
  let found = false;
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === 'accept-encoding') {
      headers[key] = 'gzip';
      found = true;
      break;
    }
  }
  if (!found) headers['Accept-Encoding'] = 'gzip';
  $done({ headers });
} catch (e) {
  console.log('[W8M search gzip request] ' + e);
  $done({});
}
