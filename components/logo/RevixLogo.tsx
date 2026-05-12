import { cn } from '@/lib/utils'

interface RevixLogoProps {
  size?: number
  className?: string
  glow?: boolean
}

// Premium geometric "R" — Tesla-inspired monoline letterform
export function RevixLogo({ size = 28, className, glow = false }: RevixLogoProps) {
  const height = Math.round(size * 1.25)

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 32 40"
      fill="none"
      className={cn(className, glow && 'drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]')}
      aria-label="Revix"
    >
      {/* Vertical stem */}
      <path
        d="M 6 36 L 6 4"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="square"
      />
      {/* Top horizontal bar */}
      <path
        d="M 6 4 L 24 4"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="square"
      />
      {/* Bowl — right vertical (with chamfered corners) */}
      <path
        d="M 24 4 L 28 8 L 28 19 L 24 23"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Mid bar (bowl base) */}
      <path
        d="M 6 23 L 24 23"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="square"
      />
      {/* Angled leg — diagonal foot */}
      <path
        d="M 20 23 L 30 36"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="square"
      />
    </svg>
  )
}

interface RevixWordmarkProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RevixWordmark({ size = 'md', className }: RevixWordmarkProps) {
  const logoSize = size === 'sm' ? 20 : size === 'lg' ? 36 : 26

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <RevixLogo size={logoSize} />
      <span
        className={cn(
          'font-sans font-semibold tracking-[0.12em] uppercase text-content-primary',
          size === 'sm' && 'text-[13px]',
          size === 'md' && 'text-[16px]',
          size === 'lg' && 'text-[22px]'
        )}
      >
        Revix
      </span>
    </div>
  )
}
