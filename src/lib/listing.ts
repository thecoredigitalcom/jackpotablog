import { SITE } from '../site';
export const crumbSchema = (items: { name: string; url: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: new URL(it.url, SITE.url).href })),
});
export const collectionSchema = (url: string, name: string) => ({
  '@type': 'CollectionPage',
  '@id': new URL(url, SITE.url).href,
  url: new URL(url, SITE.url).href,
  name,
  isPartOf: { '@id': `${SITE.url}/#website` },
  inLanguage: 'en-US',
});
