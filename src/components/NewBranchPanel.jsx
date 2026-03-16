import Button from './Button'

const INPUT_CLASS = 'w-full px-3 py-2 bg-white dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-700 focus:border-amber-500 dark:focus:border-amber-500 text-zinc-800 dark:text-zinc-100 text-sm font-medium placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none transition-colors rounded-sm'

export default function NewBranchPanel({
  branchTypes,
  branchType,
  onTypeChange,
  branchUs,
  onUsChange,
  branchName,
  onNameChange,
  branchPreview,
  onCreateBranch,
  running,
  disabled,
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 font-semibold uppercase tracking-widest">// tipo</span>
        <div className="flex gap-1.5 flex-wrap">
          {branchTypes.map(type => (
            <Button
              key={type}
              variant="toggle"
              isActive={branchType === type}
              active="bg-amber-100/50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.2)] rounded-sm"
              idle="bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-amber-400 dark:hover:border-amber-600 hover:text-amber-600 dark:hover:text-amber-400 rounded-sm"
              className="px-3 py-1.5 border text-xs font-medium tracking-wide"
              onClick={() => onTypeChange(type)}
              disabled={running}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-1.5 w-36">
          <label className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 font-semibold uppercase tracking-widest">// cód. US</label>
          <input
            type="text"
            placeholder="17433"
            value={branchUs}
            onChange={e => onUsChange(e.target.value)}
            disabled={running}
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 font-semibold uppercase tracking-widest">// nome *</label>
          <input
            type="text"
            placeholder="relatorios-agendamento"
            value={branchName}
            onChange={e => onNameChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onCreateBranch()}
            disabled={running}
            autoFocus
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex-1 text-[11px] font-mono truncate">
          {branchName.trim()
            ? <span className="text-amber-600 dark:text-amber-600">{branchPreview}</span>
            : <span className="text-zinc-300 dark:text-zinc-700 italic">feature/tipo-[us]-nome</span>}
        </span>
        <Button
          variant="solid"
          className="px-5 py-2 text-xs"
          onClick={onCreateBranch}
          disabled={running || disabled || !branchName.trim()}
        >
          {running ? 'running...' : 'criar branch'}
        </Button>
      </div>
    </div>
  )
}
