import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { sfx } from '../../lib/audio'
import { vibe } from '../../lib/haptics'

type Variant = 'primary' | 'gold' | 'ghost' | 'danger' | 'soft'

const styles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-crimson to-blood text-cream border border-rose/30 glow-crimson',
  gold: 'bg-gradient-to-b from-gold-soft to-gold text-ink border border-gold glow-gold font-semibold',
  ghost: 'bg-white/5 text-cream border border-white/15 hover:bg-white/10',
  danger: 'bg-blood/80 text-cream border border-rose/40',
  soft: 'bg-ink-card text-cream border border-white/10',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: Variant
  sound?: boolean
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  sound = true,
  onClick,
  type = 'button',
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={`btn-press rounded-2xl px-5 py-3.5 text-base font-medium disabled:opacity-40 disabled:pointer-events-none ${styles[variant]} ${className}`}
      onClick={(e) => {
        if (sound && !rest.disabled) {
          sfx.tap()
          vibe(8)
        }
        onClick?.(e)
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
