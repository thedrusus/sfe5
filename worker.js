// Guard for /assets/* (routed here via run_worker_first): a MISSING hashed bundle must be a real
// 404. The default SPA fallback ("single-page-application") rewrites every unknown path to
// index.html with 200 — including deleted content-hashed bundles — and the /assets/* _headers rule
// then stamps that HTML `immutable, max-age=1y`. Any client holding a stale HTML shell (or racing a
// deploy) permanently caches HTML under a .js URL and the app never boots again (blank shell).
// No real HTML lives under /assets/, so an HTML response here IS the fallback → 404 it, uncached.
export default {
  async fetch(request, env) {
    const res = await env.ASSETS.fetch(request);
    const ct = res.headers.get('content-type') ?? '';
    if (ct.includes('text/html')) {
      return new Response('Not found', { status: 404, headers: { 'cache-control': 'no-store' } });
    }
    return res;
  },
};
