// 轻之国度 Web App 主屏幕图标 · R3 Local
// PNG 直接嵌入脚本。运行时不再访问 GitHub、jsDelivr 或其他外部图片地址。
// iOS / SafariViewService 每次请求 apple-touch-icon 时，仅由 Loon 本地返回图片。

var ICON_B64 = "iVBORw0KGgoAAAANSUhEUgAAALQAAAC0BAMAAADP4xsBAAAAD1BMVEX///953d9KzdEowsciucAjuNzzAAADv0lEQVR42u2ay3LbNhSGPxBYpi2lZtnMUNa6M1TVZadBaj627fIB0oYPUNV8AFlm9xTRBWldTUokgTSZ4l+IlmR9OPpxcDmgwMvLy8vLy8vLy8vrK5BofWMGYB6bpzf1Zfd8BFrc1td1BsDbuHm9TK9GBy2vy+Y6rS/xpf/vgW77VmI8OuyP6hs1nw9t7BnCZzdEfHBmyFxGjqIWUTM8hXWvv4cgAlhq24bEzawiQ2XZEAUQhLAAbRcdNaHLsGnGntd58yj27diKugIwdQMUdtE58AQlUA1Hv+rM32AyIIU/LQ+ZKucJoGRbYDdqVqZe2B4+WZ+ezH0TfvFVLAU20eF/EbXSdtEH3RYrV1GLEG3D6+LV/ZV0FLUGETvxWh3sCC1HrV9WGutodbKDtYjWRy30QYsLXsuTJixGvTgxxl6GHHRfbM2QozKkO/+GGXIQanv+BT1HyrnBsdWodWs7Y9Gqo6E+3SguBN0e9oCoZUenjkQvTvt3OhB9ZshxtlXtjP5RH8f4XdZsXG2MxmNn5VNfdHsjp/nwPiW1ZMhpFotybSf5jDpPxczSHKK5Mqt7Ry3Oi8h8MPo8V/bHT08plMWVU8012pGrTNCWHoOGTLnDbTBZaXPZTeuiDpjUlthDR7u5T3afF/VHz/Zz38hN8NnaKMPd3Kdsb4IXNwDb1EEtUx87fSph7WTrvi1ITeYEbaBcuSmTgq7ZYxR6HUSuStJpOhuKDi9U0sEb6ayQjlPtCq22ypEh8D7XjqJGPUpXaH78J3aFnmZTR14T/BCErk5xZmnsCi1L5QqNzrQbr0FtlKuo+bVz2IxCy85hMwot3ono6vKyTdXz63uI39+NR//R8kbuyBCc5fWXj17uR06wbP6Yx4jlaHQwWUxkkiS3qNtgIhNIYiYT5GQ8Grn8UJfkAgQhTMlkn2OTdm2KKld6f/M/1cQkoNORaMPzc0F8kMblxwsrwRWGiPphvoBwXxQFyU+C9d2dpeRTqGj/uWB88u1qUqF3P7i46mcRl9GNpYWRlEVwxQrR3Y3ieHtXo35ZPZ7ct3ybjEw+1RT6aj4/mOmKpmbMexpiTovQ7V2xfTCYw7Og6oG/KPNRGRLVhlT3bB8OnRbtN1870OmJIypB6h3UvPTIEHR5/3h0UGPMS8UbGjCEgzMEzGrF9Kb5/JTt/c9v6ioxKqG66n5eV4ZsNoibWfPVwq3SqCSlAPII+C0woJK7gclnVivmk2+B4pv6hSpTsIooEPWt47DAy8vLy8vLy8vLy8vLy+v/on8B8DbdpShSvIQAAAAASUVORK5CYII=";

function decodeBase64(s) {
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var out = [];
  var buffer = 0;
  var bits = 0;
  for (var i = 0; i < s.length; i++) {
    var ch = s.charAt(i);
    if (ch === "=") break;
    var v = alphabet.indexOf(ch);
    if (v < 0) continue;
    buffer = (buffer << 6) | v;
    bits += 6;
    while (bits >= 8) {
      bits -= 8;
      out.push((buffer >> bits) & 255);
      if (bits === 0) buffer = 0;
      else buffer = buffer & ((1 << bits) - 1);
    }
  }
  return new Uint8Array(out);
}

var ICON_BYTES = decodeBase64(ICON_B64);

$done({
  response: {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": String(ICON_BYTES.byteLength),
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "X-Loon-LightNovel-Icon": "R3-Local"
    },
    body: ICON_BYTES
  }
});
