import { motion } from 'framer-motion'

export default function UpdateOverlay({ version, progress, status }) {
  const isInstalling = status === 'installing'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center gap-8 select-none"
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-zinc-600 text-xs font-mono tracking-widest">~/dev$</span>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-amber-400 tracking-widest uppercase">projectManager</h1>
          <span className="cursor-blink inline-block w-[7px] h-[14px] bg-amber-400 align-middle" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-5 w-72">
        <div className="text-center flex flex-col gap-1">
          <p className="text-[11px] tracking-[0.2em] uppercase text-zinc-300 font-mono font-semibold">
            {isInstalling ? 'instalando atualização' : 'baixando atualização'}
          </p>
          {version && (
            <p className="text-[10px] tracking-widest text-zinc-600 font-mono">→ v{version}</p>
          )}
        </div>

        <div className="w-full flex flex-col gap-1.5">
          <div
            className="w-full h-[3px] bg-zinc-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso da atualização"
          >
            <motion.div
              className="h-full bg-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-[9px] text-zinc-600 font-mono tracking-widest uppercase">
              {isInstalling ? 'preparando...' : 'aguarde...'}
            </span>
            <span className="text-[9px] text-amber-600 font-mono tracking-widest">
              {progress}%
            </span>
          </div>
        </div>

        <p className="text-[9px] text-zinc-700 font-mono tracking-widest text-center">
          o app será reiniciado automaticamente
        </p>
      </div>
    </motion.div>
  )
}
