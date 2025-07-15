// Update your next.config.mjs file to include image domains
const nextConfig = {
  images: {
    domains: [
      'www.google.com',
      'images.unsplash.com',
      'i.imgur.com',
      'aeldra.com',
      'forum.balmora.pl',
      'tundria2.pl',
      'cdn.tipo.live',
      'encrypted-tbn0.gstatic.com',
      'a.allegroimg.com',
      'mt2trade.s3.amazonaws.com',
      'mt2trade.s3.eu-north-1.amazonaws.com',
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
