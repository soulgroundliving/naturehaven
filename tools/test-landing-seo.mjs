import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`[seo] ${message}`);
};

const sitemap = read('public/sitemap.xml');
assert(sitemap.includes('<loc>https://naturehaven-living.vercel.app/places</loc>'), 'sitemap must include /places');
assert(!sitemap.includes('2026-09-01'), 'sitemap must not retain the stale September availability date');

const index = read('index.html');
assert(index.includes('"@type": "WebSite"'), 'index must retain the site-wide WebSite schema');
assert(!index.includes('"@type": "FAQPage"'), 'FAQPage must not be global in the static shell');
assert(!index.includes('"@type": "LocalBusiness"'), 'LocalBusiness must not be global in the static shell');
assert(!index.includes('"@type": "ApartmentComplex"'), 'ApartmentComplex must not be global in the static shell');
assert(index.includes('"availabilityStarts": "2026-10-01"') === false, 'availability must be route-managed, not duplicated in static shell');

const dist = path.join(root, 'dist');
const routeFile = (route) => route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
const schemaTypes = (html) => [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap((match) => {
  try {
    const parsed = JSON.parse(match[1]);
    return (Array.isArray(parsed) ? parsed : [parsed]).map((item) => item['@type']);
  } catch {
    return [];
  }
});

for (const route of ['/', '/places', '/journal', '/links', '/privacy']) {
  const file = routeFile(route);
  assert(fs.existsSync(file), `prerendered route is missing: ${route}`);
  const html = fs.readFileSync(file, 'utf8');
  assert(html.includes('<link rel="canonical"'), `canonical is missing: ${route}`);
  const types = schemaTypes(html);
  if (route === '/') {
    for (const type of ['WebSite', 'Organization', 'ApartmentComplex', 'FAQPage']) {
      assert(types.includes(type), `homepage must include ${type}`);
    }
    assert(html.includes('2026-10-01'), 'homepage schema must use October 2026 availability');
    assert(!types.includes('LocalBusiness'), 'homepage must not claim LocalBusiness without an eligible office');
  } else if (route === '/places') {
    assert(types.includes('CollectionPage'), '/places must include CollectionPage');
    assert(!types.includes('FAQPage') && !types.includes('ApartmentComplex') && !types.includes('LocalBusiness'), '/places must not include homepage-only schemas');
  } else if (route === '/journal') {
    assert(types.includes('CollectionPage'), '/journal must include CollectionPage');
    assert(!types.includes('FAQPage'), '/journal must not include FAQPage');
  } else {
    assert(types.includes('WebPage'), `${route} must include WebPage`);
    assert(!types.includes('FAQPage'), `${route} must not include FAQPage`);
  }
}

console.log('[seo] PASS — sitemap, static shell, prerendered route schemas, canonical tags, and availability date are consistent');
