// Canonical host + HTTPS redirect, then serve the static site.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.jackpota.blog' || (url.protocol === 'http:' && url.hostname === 'jackpota.blog')) {
      url.hostname = 'jackpota.blog';
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
