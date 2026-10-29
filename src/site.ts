// Site-wide settings. Edit here rather than in templates.
export const SITE = {
  url: 'https://jackpota.blog',
  name: 'Jackpota Blog',
  title: 'The Official Blog of Jackpota.com',
  description:
    'Guides, game explainers and news from Jackpota.com — the free-to-play social casino with slots, live dealer games and daily rewards.',
  locale: 'en_US',
  logo: '/wp-content/uploads/2025/10/logo.png',
  ogImage: '/wp-content/uploads/2026/01/Jackpota_Banner_Ad.jpg',
  // Post shown in the large hero slot on the homepage (same as the old site).
  heroSlug: 'what-ive-learned-watching-players-enjoy-social-casino-games',
  postsPerPage: 9,
  // Search engines: set INDEXING=true in the Cloudflare build env for production.
  // Anything else (staging/previews) is served noindex.
  indexing: import.meta.env.INDEXING === 'true',
  promo: {
    href: 'https://www.jackpota.com/register',
    image: '/wp-content/uploads/2026/01/Jackpota_Banner_Ad.jpg',
    alt: 'Jackpota — Get 7,500 free Gold Coins. Open a free account now.',
  },
};

export const NAV = [
  { label: 'All Games', href: 'https://www.jackpota.com/games/slots' },
  { label: 'About Us', href: 'https://www.jackpota.com/about' },
  { label: 'Promos', href: 'https://www.jackpota.com/promotions' },
  { label: 'Help', href: 'https://support.jackpota.com/hc/en-us/requests/new' },
];

export const FOOTER = {
  about: [
    { label: 'About Jackpota.com', href: 'https://www.jackpota.com/about' },
    { label: 'Terms of Service', href: 'https://www.jackpota.com/terms-of-service' },
    { label: 'Player Safety', href: 'https://www.jackpota.com/player-safety' },
    { label: 'Privacy Policy', href: 'https://www.jackpota.com/privacy' },
    { label: 'Partner With Us', href: 'https://tracker.silversocialgames.com/v2/sign-up?' },
  ],
  games: [
    { label: 'Popular', href: 'https://www.jackpota.com/games/slots/popular' },
    { label: 'Hold and Win', href: 'https://www.jackpota.com/games/slots/hold-and-win' },
    { label: 'Classic', href: 'https://www.jackpota.com/games/slots/classic-games' },
    { label: 'Megaways', href: 'https://www.jackpota.com/games/slots/megaways' },
    { label: 'All New', href: 'https://www.jackpota.com/games/slots/newest' },
    { label: 'Slots', href: 'https://www.jackpota.com/games/slots' },
  ],
  social: [] as { label: string; href: string }[],
};
