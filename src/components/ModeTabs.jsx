import Button from './Button'

const TABS = [
  { id: 'hotfix', label: 'hotfix' },
  { id: 'newbranch', label: 'new-branch' },
]

export default function ModeTabs({ mode, onSwitch, disabled }) {
  return (
    <div className="flex gap-0 border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden">
      {TABS.map((tab, i) => (
        <Button
          key={tab.id}
          variant="tab"
          isActive={mode === tab.id}
          className={`px-4 py-1.5 text-[11px] ${i < TABS.length - 1 ? 'border-r border-zinc-200 dark:border-zinc-800' : ''}`}
          onClick={() => onSwitch(tab.id)}
          disabled={disabled}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
