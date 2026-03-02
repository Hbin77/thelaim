import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'THELAIM - Global Fashion Export',
    short_name: 'THELAIM',
    description: 'Premium garment export company',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#004346',
    icons: [
      {
        src: '/favicon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
