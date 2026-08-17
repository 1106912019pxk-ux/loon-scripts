// 轻之国度 Web App 主屏幕图标
// 接管 iOS / SafariViewService 对 apple-touch-icon 的请求，并返回自定义 PNG。

var ICON_URL = "https://raw.githubusercontent.com/1106912019pxk-ux/loon-scripts/main/lightnovel/lightnovel-icon.png?v=1";

$httpClient.get({
  url: ICON_URL,
  headers: {
    "Cache-Control": "no-cache"
  },
  "binary-mode": true,
  timeout: 5000
}, function (error, response, data) {
  if (error || !response || response.status < 200 || response.status >= 300 || !data) {
    var reason = error || (response ? ("HTTP " + response.status) : "no response");
    $done({
      response: {
        status: 502,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Loon-LightNovel-Icon": "fetch-failed"
        },
        body: "icon fetch failed: " + reason
      }
    });
    return;
  }

  var bytes = data;
  if (typeof ArrayBuffer !== "undefined" && data instanceof ArrayBuffer) {
    bytes = new Uint8Array(data);
  } else if (typeof Uint8Array !== "undefined" && !(data instanceof Uint8Array) && data.buffer instanceof ArrayBuffer) {
    bytes = new Uint8Array(data.buffer, data.byteOffset || 0, data.byteLength || data.length);
  }

  $done({
    response: {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "X-Loon-LightNovel-Icon": "R1"
      },
      body: bytes
    }
  });
});
