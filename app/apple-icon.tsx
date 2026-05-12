import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
          borderRadius: '38px',
        }}
      >
        <svg width="100" height="125" viewBox="0 0 32 40" fill="none">
          <path d="M 6 36 L 6 4" stroke="white" strokeWidth="3.5" strokeLinecap="square" />
          <path d="M 6 4 L 24 4" stroke="white" strokeWidth="3.5" strokeLinecap="square" />
          <path
            d="M 24 4 L 28 8 L 28 19 L 24 23"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path d="M 6 23 L 24 23" stroke="white" strokeWidth="3.5" strokeLinecap="square" />
          <path d="M 20 23 L 30 36" stroke="white" strokeWidth="3.5" strokeLinecap="square" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
