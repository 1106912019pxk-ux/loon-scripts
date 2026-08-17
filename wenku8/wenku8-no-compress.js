// Wenku8 request helper for Loon: disable compressed response bodies.
try {
  const headers = Object.assign({}, ($request && $request.headers) || {});
  let found = false;
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === 'accept-encoding') {
      headers[key] = 'identity';
      found = true;
    }
  }
  if (!found) headers['Accept-Encoding'] = 'identity';
  headers['Cache-Control'] = 'no-cache';
  headers['Pragma'] = 'no-cache';
  $done({headers});
} catch (e) {
  console.log('[W8M no-compress] ' + e);
  $done({});
}
