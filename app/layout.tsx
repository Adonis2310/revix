import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Revix',
  description: 'Premium maintenance tracking for Honda XR150L 2025',
  applicationName: 'Revix',
  appleWebApp: {
    capable: true,
    title: 'Revix',
    statusBarStyle: 'black-translucent',
    startupImage: [
      {
        url: '/splash/splash-2048x2732.png',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#050507',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* PWA */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />

        {/* iOS status bar */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-bg-base text-content-primary antialiased noise-overlay">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}

function ServiceWorkerRegistration() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function() {});
            });
          }
        `,
      }}
    />
  )
}
