import Button from './Button'

const INPUT_CLASS = 'w-full px-3 py-2 bg-white dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-700 focus:border-red-500 dark:focus:border-red-500 text-zinc-800 dark:text-zinc-100 text-sm font-medium placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none transition-colors rounded-sm'

export default function DeleteBranchPanel({
  branchName,
  onNameChange,
  onDelete,
  running,
  disabled,
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="del-branch-name" className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">// nome completo do branch</label>
        <div className="flex gap-2">
          <div className="relative flex-1 flex items-center">
            <span className="absolute left-3 text-red-500 dark:text-red-700 text-sm select-none" aria-hidden="true">›</span>
            <input
              id="del-branch-name"
              name="del-branch-name"
              autoComplete="off"
              type="text"
              placeholder="feature/sustentacao-17433-relatorios"
              value={branchName}
              onChange={e => onNameChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onDelete()}
              disabled={running || disabled}
              autoFocus
              className={`${INPUT_CLASS} pl-7`}
            />
          </div>
          <Button
            variant="solid"
            className="px-5 py-2 text-xs bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            onClick={onDelete}
            disabled={running || disabled || !branchName.trim()}
          >
            {running ? 'running...' : 'deletar -D'}
          </Button>
        </div>
      </div>
    </div>
  )
}
