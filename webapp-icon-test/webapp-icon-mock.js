// Loon Web App icon mock · R4
// Intercepts iOS/SafariViewService requests for apple-touch-icon and returns the GitHub PNG directly.

var ICON_URL = "https://raw.githubusercontent.com/1106912019pxk-ux/loon-scripts/main/webapp-icon-test/icon.png?v=5";

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
          "X-Loon-WebApp-Icon": "R4-fetch-failed"
        },
        body: "icon fetch failed: " + reason
      }
    });
    return;
  }

  $done({
    response: {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "X-Loon-WebApp-Icon": "R4"
      },
      body: data
    }
  });
});
