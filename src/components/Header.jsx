export default function Header({ dark, onToggleTheme }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium">~/dev$</span>
        <h1 className="text-base font-bold text-amber-600 dark:text-amber-400 tracking-widest uppercase">projectManager</h1>
        <span className="cursor-blink inline-block w-[7px] h-[14px] bg-amber-600 dark:bg-amber-400 align-middle" />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleTheme}
          className="text-[10px] tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors uppercase border border-zinc-300 dark:border-zinc-700 px-2 py-0.5 rounded-sm font-medium"
        >
          {dark ? '☀ light' : '◐ dark'}
        </button>
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 tracking-widest font-medium">// git-flow manager</span>
      </div>
    </header>
  )
}
