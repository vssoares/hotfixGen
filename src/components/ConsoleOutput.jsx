import { useRef, useEffect } from 'react'
import Button from './Button'

export default function ConsoleOutput({ lines, running, onClear }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 font-semibold uppercase tracking-widest">// output</span>
          {running && (
            <span className="flex items-center gap-1 text-[10px] text-amber-600">
              <span className="cursor-blink">▋</span>
              <span className="tracking-widest uppercase">running</span>
            </span>
          )}
        </div>
        {lines.length > 0 && !running && (
          <Button
            variant="outline"
            color="violet"
            className="px-2 py-0.5 text-[10px] tracking-widest uppercase"
            onClick={onClear}
          >
            clear
          </Button>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 rounded-sm p-4 font-mono text-[12px] leading-relaxed" aria-live="polite" aria-atomic="false">
        {lines.length === 0 ? (
          <span className="text-zinc-400 dark:text-zinc-500 italic">awaiting input...</span>
        ) : (
          lines.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap break-all ${
                line.type === 'out'    ? 'text-zinc-700 dark:text-zinc-200' :
                line.type === 'err'    ? 'text-red-500' :
                'text-amber-600 dark:text-amber-500'
              }`}
            >
              {line.text}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  )
}
