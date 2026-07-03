import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  /** 'article' gives journal posts a proper social-share card (date +
   * section show up in LINE/Facebook previews). Defaults to 'website'. */
  ogType?: 'website' | 'article';
  publishedTime?: string;
  section?: string;
}

// Homepage defaults to restore on unmount. Restoring the *captured previous*
// values is wrong on a direct journal-page load: the prerendered HTML already
// carries the journal tags, so "previous" IS the journal — navigating home
// then kept the journal title. The only route that sets no meta is the
// homepage, so restoring these constants is always correct.
const HOME_META = {
  title: 'Nature Haven — Lite Service Apartment in Saimai, Bangkok',
  description:
    'Lite Service Apartment เลี้ยงสัตว์ได้ทั้งตึก สไตล์ MUJI minimal ในสายไหม กรุงเทพฯ — 25 ตร.ม. 1 นอน ครัวแยก ระเบียง รวม Wi-Fi + ทำความสะอาด + ดูแลแอร์ เริ่ม 6,900 บาท/เดือน เปิดกันยายน 2026',
  canonical: 'https://naturehaven-living.vercel.app/',
  ogImage: 'https://naturehaven-living.vercel.app/og-image.jpg',
  ogType: 'website',
} as const;

function setAttr(selector: string, attr: string, value: string | undefined): void {
  const el = document.head.querySelector(selector);
  if (el && value !== undefined) el.setAttribute(attr, value);
}

// article:published_time / article:section have no matching <meta> tag in
// the static index.html (homepage is never an article), so they must be
// created on apply and removed on restore — setAttr's "element must already
// exist" contract doesn't fit them.
function setArticleMeta(property: string, content: string | undefined): void {
  let el = document.head.querySelector(`meta[property="${property}"]`);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function applyMeta({ title, description, canonical, ogImage, ogType = 'website', publishedTime, section }: PageMeta): void {
  document.title = title;
  setAttr('meta[name="description"]', 'content', description);
  setAttr('link[rel="canonical"]', 'href', canonical);
  setAttr('meta[property="og:title"]', 'content', title);
  setAttr('meta[property="og:description"]', 'content', description);
  setAttr('meta[property="og:url"]', 'content', canonical);
  setAttr('meta[property="og:image"]', 'content', ogImage);
  setAttr('meta[property="og:type"]', 'content', ogType);
  setAttr('meta[name="twitter:title"]', 'content', title);
  setAttr('meta[name="twitter:description"]', 'content', description);
  setAttr('meta[name="twitter:image"]', 'content', ogImage);
  setArticleMeta('article:published_time', ogType === 'article' ? publishedTime : undefined);
  setArticleMeta('article:section', ogType === 'article' ? section : undefined);
}

/**
 * Per-route <head> management. The static index.html carries the homepage
 * defaults; journal routes override them here and restore the homepage
 * defaults on unmount. tools/prerender.mjs snapshots each route AFTER these
 * effects run, so crawlers see the per-article title/description/canonical.
 */
export default function usePageMeta(meta: PageMeta) {
  const { title, description, canonical, ogImage, ogType, publishedTime, section } = meta;
  useEffect(() => {
    applyMeta({ title, description, canonical, ogImage, ogType, publishedTime, section });
    return () => {
      applyMeta(HOME_META);
    };
  }, [title, description, canonical, ogImage, ogType, publishedTime, section]);
}

/** Inject a JSON-LD block for the lifetime of the page. Pass null to skip. */
export function useJsonLd(id: string, data: object | null) {
  useEffect(() => {
    if (!data) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [id, data]);
}
