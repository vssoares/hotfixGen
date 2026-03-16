import { useState } from 'react'
import Button from './Button'
import AddProjectModal from './AddProjectModal'

export default function ProjectSelector({ projects, selected, onSelect, onAdd, onRemove, disabled }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">// projeto</span>
        <div className="flex flex-wrap gap-1.5 items-center">
          {projects.map(project => (
            <div key={project.name} className="relative group">
              <Button
                variant="toggle"
                isActive={selected === project.name}
                active="bg-amber-100/50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.2)] rounded-sm"
                idle="bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-amber-400 dark:hover:border-amber-600 hover:text-amber-600 dark:hover:text-amber-400 rounded-sm"
                className="px-3 py-1.5 border text-xs font-medium tracking-wide"
                onClick={() => onSelect(project.name)}
                disabled={disabled}
              >
                {project.name}
              </Button>
              {project.isCustom && (
                <button
                  className="absolute -top-1.5 -right-1.5 hidden group-hover:flex items-center justify-center w-3.5 h-3.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-red-500 hover:text-white transition-colors text-[8px] leading-none cursor-pointer"
                  onClick={() => onRemove(project.name)}
                  title="Remover projeto"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            className="cursor-pointer px-3 py-1.5 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 hover:border-amber-400 dark:hover:border-amber-600 hover:text-amber-500 dark:hover:text-amber-500 text-xs rounded-sm transition-colors duration-100"
            onClick={() => setShowModal(true)}
            disabled={disabled}
            title="Adicionar projeto"
          >
            +
          </button>
        </div>
      </div>

      {showModal && (
        <AddProjectModal
          onAdd={onAdd}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
