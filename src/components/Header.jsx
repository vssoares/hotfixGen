import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'

const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const banner = {
  initial: { opacity: 0, y: prefersReduced ? 0 : -6 },
  animate: { opacity: 1, y: 0, transition: { duration: prefersReduced ? 0 : 0.2 } },
  exit:    { opacity: 0, y: prefersReduced ? 0 : -6, transition: { duration: prefersReduced ? 0 : 0.15 } },
}

export default function Header({ dark, onToggleTheme, setUpdateInfo }) {
  const [updateError, setUpdateError] = useState('')
  const [pendingUpdate, setPendingUpdate] = useState(null) // { version, update }
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    async function checkForUpdate() {
      try {
        const update = await check()
        if (!update?.available) return
        setPendingUpdate({ version: update.version, update })
      } catch {
        // silently ignore check errors
      }
    }

    if (typeof window.__TAURI_INTERNALS__ !== 'undefined') {
      setTimeout(checkForUpdate, 3000)
    }
  }, [])

  async function handleUpdate() {
    if (!pendingUpdate || isUpdating) return
    const { update, version } = pendingUpdate
    setIsUpdating(true)
    setPendingUpdate(null)

    try {
      setUpdateInfo({ version, progress: 0, status: 'downloading' })

      let downloaded = 0
      let total = 0

      await update.downloadAndInstall((event) => {
        if (event.event === 'Started') {
          total = event.data.contentLength ?? 0
        } else if (event.event === 'Progress') {
          downloaded += event.data.chunkLength
          if (total > 0) {
            setUpdateInfo(prev => ({ ...prev, progress: Math.floor((downloaded / total) * 100) }))
          }
        } else if (event.event === 'Finished') {
          setUpdateInfo(prev => ({ ...prev, progress: 100, status: 'installing' }))
        }
      })

      await relaunch()
    } catch (err) {
      setUpdateInfo(null)
      setIsUpdating(false)
      setUpdateError(err?.message || 'falha ao atualizar')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium">~/dev$</span>
          <h1 className="text-base font-bold text-amber-600 dark:text-amber-400 tracking-widest uppercase">projectManager</h1>
          <span className="cursor-blink inline-block w-[7px] h-[14px] bg-amber-600 dark:bg-amber-400 align-middle" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            aria-label={dark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            className="text-[10px] tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors uppercase border border-zinc-300 dark:border-zinc-700 px-2 py-0.5 rounded-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
          >
            <span aria-hidden="true">{dark ? '☀ light' : '◐ dark'}</span>
          </button>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 tracking-widest font-medium">// git-flow manager</span>
        </div>
      </header>

      <AnimatePresence>
        {pendingUpdate && (
          <motion.div key="update-available" {...banner}
            className="flex items-center justify-between border border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-sm"
          >
            <span className="text-[10px] tracking-widest text-amber-700 dark:text-amber-400 uppercase truncate font-mono">
              <span aria-hidden="true">↑ </span>atualização disponível → v{pendingUpdate.version}
            </span>
            <button
              disabled={isUpdating}
              onClick={handleUpdate}
              className="text-[10px] tracking-widest uppercase border border-amber-500 dark:border-amber-500 text-amber-700 dark:text-amber-400 hover:bg-amber-500 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed px-2 py-0.5 transition-colors cursor-pointer shrink-0 ml-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
            >
              {isUpdating ? 'atualizando...' : 'atualizar'}
            </button>
          </motion.div>
        )}
        {updateError && (
          <motion.div key="error" {...banner}
            className="flex items-center justify-between border border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-sm"
          >
            <span className="text-[10px] tracking-widest text-red-600 dark:text-red-400 uppercase truncate">
              <span aria-hidden="true">✗ </span>erro: {updateError}
            </span>
            <button
              className="text-[10px] tracking-widest uppercase border border-red-400 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white px-2 py-0.5 transition-colors cursor-pointer shrink-0 ml-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
              onClick={() => setUpdateError('')}
            >
              fechar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
