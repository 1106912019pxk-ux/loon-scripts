// 轻之国度 Web App 图标声明注入 · R2
// 删除页面原有 apple-touch-icon 声明，并注入唯一地址，避免 iOS 继续使用旧缓存/旧声明。

var body = $response.body || "";

if (!body) {
  $done({});
} else {
  // 移除现有 apple-touch-icon / precomposed 声明，避免优先级冲突。
  body = body.replace(/<link\b[^>]*rel=["'][^"']*apple-touch-icon(?:-precomposed)?[^"']*["'][^>]*>/gi, "");

  var tag = '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-lain-v2.png">';

  if (/<\/head>/i.test(body)) {
    body = body.replace(/<\/head>/i, tag + "</head>");
  } else {
    body = tag + body;
  }

  $done({ body: body });
}
