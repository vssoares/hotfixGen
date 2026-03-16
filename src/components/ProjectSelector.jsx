import Button from './Button'

export default function ProjectSelector({ projects, selected, onSelect, disabled }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 font-semibold uppercase tracking-widest">// projeto</span>
      <div className="flex flex-wrap gap-1.5">
        {projects.map(project => (
          <Button
            key={project}
            variant="toggle"
            isActive={selected === project}
            active="bg-amber-100/50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.2)] rounded-sm"
            idle="bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-amber-400 dark:hover:border-amber-600 hover:text-amber-600 dark:hover:text-amber-400 rounded-sm"
            className="px-3 py-1.5 border text-xs font-medium tracking-wide"
            onClick={() => onSelect(project)}
            disabled={disabled}
          >
            {project}
          </Button>
        ))}
      </div>
    </div>
  )
}
