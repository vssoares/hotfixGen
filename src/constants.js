export const BASE_PATH = 'C:\\Users\\ViniciusSoaresdeSant\\Desktop\\Fretefy\\Front'

export const PROJECTS = [
  'ffy-firulis',
  'ffy-portal',
  'ffy-portal-agendamento',
  'fretefy-ci-new-design',
  'fretefy-front',
]

export const BRANCH_TYPES = ['sustentacao', 'manutencao', 'votorantim', 'vcmonitoramento']

export const ACTIONS = [
  {
    id: 'start',
    label: 'START',
    idle:   'bg-transparent text-zinc-500 dark:text-zinc-600 border-zinc-300 dark:border-zinc-800 hover:border-green-500 dark:hover:border-green-600 hover:text-green-600 dark:hover:text-green-400 uppercase tracking-widest',
    active: 'bg-green-100/50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-500 dark:border-green-600 shadow-[0_0_14px_rgba(74,222,128,0.2)] uppercase tracking-widest',
  },
  {
    id: 'finish',
    label: 'FINISH',
    idle:   'bg-transparent text-zinc-500 dark:text-zinc-600 border-zinc-300 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest',
    active: 'bg-blue-100/50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-500 dark:border-blue-600 shadow-[0_0_14px_rgba(96,165,250,0.2)] uppercase tracking-widest',
  },
  {
    id: 'delete',
    label: 'DELETE',
    idle:   'bg-transparent text-zinc-500 dark:text-zinc-600 border-zinc-300 dark:border-zinc-800 hover:border-red-500 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400 uppercase tracking-widest',
    active: 'bg-red-100/50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-500 dark:border-red-600 shadow-[0_0_14px_rgba(248,113,113,0.2)] uppercase tracking-widest',
  },
]
