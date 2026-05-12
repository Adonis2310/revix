import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050507',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '112px',
        }}
      >
        {/* Geometric R logo */}
        <svg width="280" height="350" viewBox="0 0 32 40" fill="none">
          {/* Vertical stem */}
          <path d="M 6 36 L 6 4" stroke="white" strokeWidth="3.2" strokeLinecap="square" />
          {/* Top bar */}
          <path d="M 6 4 L 24 4" stroke="white" strokeWidth="3.2" strokeLinecap="square" />
          {/* Bowl sides */}
          <path
            d="M 24 4 L 28 8 L 28 19 L 24 23"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {/* Mid bar */}
          <path d="M 6 23 L 24 23" stroke="white" strokeWidth="3.2" strokeLinecap="square" />
          {/* Leg */}
          <path d="M 20 23 L 30 36" stroke="white" strokeWidth="3.2" strokeLinecap="square" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
