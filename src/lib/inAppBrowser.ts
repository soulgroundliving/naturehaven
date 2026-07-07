// Facebook/Instagram/Messenger/TikTok in-app webviews frequently block or
// hang on cross-domain redirect chains like lin.ee -> line.me (the button
// "does nothing" or freezes on a blank white page even though the link
// itself is correct — confirmed live 2026-07-07: URL bar shows the in-app
// "Facebook" context, tapping the LINE CTA a second time hangs blank).
// There is no reliable way to force these webviews to hand off to the real
// browser or the LINE app via JS, so we detect them and offer a fallback
// (open-in-browser instructions + copy LINE ID) instead of a silent failure.
// Deliberately excludes LINE's own in-app browser (`Line/` UA) — that
// webview handles line.me natively and is the intended sharing path.
const IN_APP_BROWSER_UA = /FBAN|FBAV|FB_IAB|Instagram|MicroMessenger|TikTok|BytedanceWebview/i;

export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  return IN_APP_BROWSER_UA.test(navigator.userAgent);
}
