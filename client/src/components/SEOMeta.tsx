import { useEffect } from 'react';

interface SEOMetaProps {
  title: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
  noIndex?: boolean;
}

/**
 * Lightweight SEO meta tag manager.
 * Sets <title> and key <meta> tags on mount, restores on unmount.
 */
const SEOMeta = ({
  title,
  description = 'Discover premium jewellery collections at Zaviraa. Rings, bangles, earrings and more.',
  ogImage = '/og-default.jpg',
  ogUrl,
  noIndex = false,
}: SEOMetaProps) => {
  useEffect(() => {
    const prevTitle = document.title;

    // Title
    document.title = `${title} | Zaviraa`;

    // Helper
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMeta('og:title', `${title} | Zaviraa`, true);
    setMeta('og:description', description, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:url', ogUrl || window.location.href, true);
    setMeta('og:type', 'website', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', `${title} | Zaviraa`);
    setMeta('twitter:description', description);

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, ogImage, ogUrl, noIndex]);

  return null;
};

export default SEOMeta;
