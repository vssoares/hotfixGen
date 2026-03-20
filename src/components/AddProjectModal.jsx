import { useState } from 'react'
import { open } from '@tauri-apps/plugin-dialog'
import Button from './Button'

export default function AddProjectModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [folderPath, setFolderPath] = useState('')

  async function handleBrowse() {
    const selected = await open({ directory: true, multiple: false })
    if (!selected) return
    setFolderPath(selected)
    if (!name.trim()) {
      setName(selected.split(/[\\/]/).pop())
    }
  }

  function handleAdd() {
    if (!name.trim() || !folderPath.trim()) return
    onAdd({ name: name.trim(), path: folderPath.trim() })
    onClose()
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={e => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div
        className="w-[480px] bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 flex flex-col gap-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <span id="modal-title" className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">// novo projeto</span>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="proj-name" className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">nome</label>
          <input
            id="proj-name"
            name="proj-name"
            autoComplete="off"
            className="bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 text-xs px-3 py-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 focus:border-amber-400 dark:focus:border-amber-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            placeholder="ex: meu-projeto"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="proj-path" className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">caminho</label>
          <div className="flex gap-2">
            <input
              id="proj-path"
              name="proj-path"
              autoComplete="off"
              className="flex-1 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 text-xs px-3 py-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 focus:border-amber-400 dark:focus:border-amber-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              placeholder="C:\caminho\do\projeto"
              value={folderPath}
              onChange={e => setFolderPath(e.target.value)}
            />
            <button
              className="cursor-pointer px-3 py-2 text-[11px] tracking-widest uppercase whitespace-nowrap border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-100"
              onClick={handleBrowse}
            >
              Selecionar
            </button>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <button
            className="cursor-pointer px-4 py-1.5 text-[11px] tracking-widest uppercase border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-500 dark:hover:border-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors duration-100"
            onClick={onClose}
          >
            cancelar
          </button>
          <Button
            variant="outline"
            color="amber"
            className="px-4 py-1.5 text-[11px] tracking-widest uppercase"
            onClick={handleAdd}
            disabled={!name.trim() || !folderPath.trim()}
          >
            adicionar
          </Button>
        </div>
      </div>
    </div>
  )
}
