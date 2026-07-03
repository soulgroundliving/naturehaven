import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}

function setAttr(selector: string, attr: string, value: string | undefined): () => void {
  const el = document.head.querySelector(selector);
  if (!el || value === undefined) return () => {};
  const prev = el.getAttribute(attr);
  el.setAttribute(attr, value);
  return () => {
    if (prev !== null) el.setAttribute(attr, prev);
  };
}

/**
 * Per-route <head> management. The static index.html carries the homepage
 * defaults; journal routes override them here and restore on unmount so
 * client-side navigation back to `/` shows the original tags again.
 * tools/prerender.mjs snapshots each route AFTER these effects run, so
 * crawlers see the per-article title/description/canonical.
 */
export default function usePageMeta({ title, description, canonical, ogImage }: PageMeta) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    const undos = [
      setAttr('meta[name="description"]', 'content', description),
      setAttr('link[rel="canonical"]', 'href', canonical),
      setAttr('meta[property="og:title"]', 'content', title),
      setAttr('meta[property="og:description"]', 'content', description),
      setAttr('meta[property="og:url"]', 'content', canonical),
      setAttr('meta[property="og:image"]', 'content', ogImage),
      setAttr('meta[name="twitter:title"]', 'content', title),
      setAttr('meta[name="twitter:description"]', 'content', description),
      setAttr('meta[name="twitter:image"]', 'content', ogImage),
    ];
    return () => {
      document.title = prevTitle;
      undos.forEach((undo) => undo());
    };
  }, [title, description, canonical, ogImage]);
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
