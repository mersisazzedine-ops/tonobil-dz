import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary/90 active:bg-primary/80 focus:ring-2 focus:ring-primary/50',
    secondary:
      'bg-secondary text-foreground hover:bg-secondary/80 active:bg-secondary/60 focus:ring-2 focus:ring-primary/50',
    outline:
      'border-2 border-primary text-primary hover:bg-primary/5 active:bg-primary/10 focus:ring-2 focus:ring-primary/50',
    ghost:
      'text-foreground hover:bg-secondary active:bg-secondary/50 focus:ring-2 focus:ring-primary/50',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
