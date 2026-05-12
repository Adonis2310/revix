import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Revix — Motorcycle Maintenance',
    short_name: 'Revix',
    description: 'Premium maintenance tracking for Honda XR150L 2025',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#050507',
    theme_color: '#050507',
    categories: ['utilities', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
