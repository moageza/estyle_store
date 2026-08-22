import { useEffect } from 'react';

/**
 * Dynamically updates <title>, meta description, and Open Graph tags
 * based on the current page. Call this hook in any page component.
 */
export function useSEO({
  title,
  description,
  image,
  url,
  type = 'website',
}: {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | eStyle` : 'eStyle | متجر الأزياء العصرية';
    document.title = fullTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:type', type);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:card', 'summary_large_image');

    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
    }

    if (url) {
      setMeta('property', 'og:url', url);
      setMeta('name', 'twitter:url', url);
    }

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = 'eStyle | متجر الأزياء العصرية - اكتشف ستايلك الجديد';
    };
  }, [title, description, image, url, type]);
}
