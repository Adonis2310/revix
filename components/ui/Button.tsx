'use client'

import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-blue text-white border border-accent-blue/80 hover:bg-[#1A70FF] active:bg-[#0050DD] shadow-glow-blue/30',
  secondary:
    'bg-bg-elevated text-content-primary border border-line hover:bg-bg-card hover:border-line-strong',
  ghost:
    'bg-transparent text-content-secondary border border-transparent hover:text-content-primary hover:bg-bg-elevated',
  danger:
    'bg-accent-red/10 text-accent-red border border-accent-red/20 hover:bg-accent-red/20',
  success:
    'bg-accent-green/10 text-accent-green border border-accent-green/20 hover:bg-accent-green/20',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-label-md gap-1.5 rounded-xl',
  md: 'h-10 px-4 text-label-lg gap-2 rounded-xl',
  lg: 'h-12 px-6 text-[13px] gap-2 rounded-2xl font-semibold tracking-[0.04em]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      loading = false,
      disabled = false,
      fullWidth = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? {} : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        disabled={isDisabled}
        className={cn(
          'relative inline-flex items-center justify-center',
          'font-sans font-medium',
          'transition-colors duration-150',
          'select-none outline-none',
          'focus-visible:ring-2 focus-visible:ring-accent-blue/50 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-base',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner size={size} />
          </span>
        )}
        <span className={cn('flex items-center gap-inherit', loading && 'opacity-0')}>
          {children}
        </span>
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

function Spinner({ size }: { size: ButtonSize }) {
  const dim = size === 'sm' ? 12 : size === 'lg' ? 18 : 14
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
