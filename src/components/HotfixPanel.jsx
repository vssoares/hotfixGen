import Button from './Button'

const INPUT_CLASS = 'flex-1 px-3 py-2 bg-white dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-700 focus:border-amber-500 dark:focus:border-amber-500 text-zinc-800 dark:text-zinc-100 text-sm font-medium placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none transition-colors rounded-sm'

export default function HotfixPanel({
  actions,
  selectedAction,
  onActionClick,
  version,
  onVersionChange,
  onExecute,
  running,
  disabled,
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {actions.map(({ id, label, idle, active }) => (
          <Button
            key={id}
            variant="toggle"
            isActive={selectedAction === id}
            active={active}
            idle={idle}
            className="flex-1 py-2.5 border text-xs font-semibold"
            onClick={() => onActionClick(id)}
            disabled={running || disabled}
          >
            {label}
          </Button>
        ))}
      </div>

      {selectedAction && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="hotfix-version" className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 font-semibold uppercase tracking-widest">// versão</label>
          <div className="flex gap-2">
            <div className="relative flex-1 flex items-center">
              <span className="absolute left-3 text-amber-500 dark:text-amber-700 text-sm select-none" aria-hidden="true">›</span>
              <input
                id="hotfix-version"
                name="hotfix-version"
                autoComplete="off"
                type="text"
                placeholder="3.13.4"
                value={version}
                onChange={e => onVersionChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onExecute()}
                disabled={running}
                autoFocus
                className={`${INPUT_CLASS} pl-7`}
              />
            </div>
            <Button
              variant="solid"
              className="px-5 py-2 text-xs"
              onClick={onExecute}
              disabled={running || !version.trim()}
            >
              {running ? 'running...' : 'executar'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
