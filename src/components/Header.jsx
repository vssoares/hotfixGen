import { useState, useEffect } from 'react'

export default function Header({ dark, onToggleTheme }) {
  const [updateState, setUpdateState] = useState(null) // null | 'checking' | 'available' | 'downloading' | 'ready' | 'error'
  const [updateVersion, setUpdateVersion] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!window.api?.update) return

    window.api.update.onChecking(()      => setUpdateState('checking'))
    window.api.update.onAvailable((ver)  => { setUpdateState('available'); setUpdateVersion(ver) })
    window.api.update.onNotAvailable(()  => setUpdateState(null))
    window.api.update.onProgress((pct)   => { setUpdateState('downloading'); setProgress(pct) })
    window.api.update.onDownloaded(()    => setUpdateState('ready'))
    window.api.update.onError(()         => setUpdateState(null))
  }, [])

  return (
    <div className="flex flex-col gap-2">
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

      {updateState === 'available' && (
        <div className="flex items-center justify-between border border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-sm">
          <span className="text-[10px] tracking-widest text-blue-600 dark:text-blue-400 uppercase">
            ↓ nova versão {updateVersion} disponível
          </span>
          <button
            className="text-[10px] tracking-widest uppercase border border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white px-2 py-0.5 transition-colors cursor-pointer"
            onClick={() => window.api.update.download()}
          >
            baixar
          </button>
        </div>
      )}

      {updateState === 'downloading' && (
        <div className="flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 rounded-sm">
          <span className="text-[10px] tracking-widest text-zinc-500 dark:text-zinc-400 uppercase shrink-0">baixando...</span>
          <div className="flex-1 h-[2px] bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] tracking-widest text-blue-500 dark:text-blue-400 uppercase w-8 text-right">{progress}%</span>
        </div>
      )}

      {updateState === 'ready' && (
        <div className="flex items-center justify-between border border-green-500 dark:border-green-700 bg-green-50 dark:bg-green-950/40 px-3 py-1.5 rounded-sm">
          <span className="text-[10px] tracking-widest text-green-600 dark:text-green-400 uppercase">
            ✓ atualização pronta para instalar
          </span>
          <button
            className="text-[10px] tracking-widest uppercase border border-green-500 dark:border-green-600 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white dark:hover:bg-green-600 dark:hover:text-white px-2 py-0.5 transition-colors cursor-pointer"
            onClick={() => window.api.update.install()}
          >
            reiniciar e instalar
          </button>
        </div>
      )}
    </div>
  )
}
