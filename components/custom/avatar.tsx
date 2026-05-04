import { cn } from '@/lib/utils'

interface AvatarProps {
  initials: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ initials, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary text-white font-semibold',
        sizes[size],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  )
}
