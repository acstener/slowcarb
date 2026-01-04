import { cn } from '@/lib/utils'

interface MacroBadgeProps {
  type: 'protein' | 'carbs' | 'fat'
  value: number
  size?: 'sm' | 'md'
}

const macroConfig = {
  protein: {
    label: 'P',
    className: 'bg-red-50 text-red-600',
  },
  carbs: {
    label: 'C',
    className: 'bg-orange-50 text-orange-600',
  },
  fat: {
    label: 'F',
    className: 'bg-green-50 text-green-700',
  },
}

export function MacroBadge({ type, value, size = 'sm' }: MacroBadgeProps) {
  const config = macroConfig[type]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-mono font-medium',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      )}
    >
      {value}{config.label}
    </span>
  )
}

interface MacroDisplayProps {
  protein: number
  carbs: number
  fat: number
  size?: 'sm' | 'md'
  className?: string
}

export function MacroDisplay({ protein, carbs, fat, size = 'sm', className }: MacroDisplayProps) {
  return (
    <div className={cn('flex gap-1.5', className)}>
      <MacroBadge type="protein" value={protein} size={size} />
      <MacroBadge type="carbs" value={carbs} size={size} />
      <MacroBadge type="fat" value={fat} size={size} />
    </div>
  )
}
