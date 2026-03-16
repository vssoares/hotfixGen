const BASE = 'cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-100'

const SOLID = {
  amber: 'bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest rounded-sm',
}

const OUTLINE = {
  amber:  'border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-600 dark:text-zinc-300 hover:border-amber-500 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 rounded-sm font-medium',
  violet: 'border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-500 dark:text-zinc-400 hover:border-amber-500 dark:hover:border-amber-600 hover:text-amber-500 dark:hover:text-amber-500 rounded-sm font-medium',
}

export default function Button({
  children,
  variant = 'solid',
  color = 'amber',
  isActive,
  active,
  idle,
  className = '',
  ...props
}) {
  let variantClass = ''

  if (variant === 'solid') {
    variantClass = SOLID[color] ?? SOLID.amber
  } else if (variant === 'outline') {
    variantClass = OUTLINE[color] ?? OUTLINE.amber
  } else if (variant === 'tab') {
    variantClass = isActive
      ? 'text-amber-600 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/40 rounded-sm uppercase tracking-widest font-semibold'
      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-sm uppercase tracking-widest font-semibold'
  } else if (variant === 'toggle') {
    variantClass = isActive ? (active ?? '') : (idle ?? '')
  }

  return (
    <button className={`${BASE} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
