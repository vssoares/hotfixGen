import { useState, useEffect } from 'react'
import { BASE_PATH, PROJECTS, BRANCH_TYPES, ACTIONS } from './constants'
import Header from './components/Header'
import ProjectSelector from './components/ProjectSelector'
import ModeTabs from './components/ModeTabs'
import HotfixPanel from './components/HotfixPanel'
import NewBranchPanel from './components/NewBranchPanel'
import ConsoleOutput from './components/ConsoleOutput'
import Button from './components/Button'

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved !== null ? saved === 'dark' : true
  })
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedAction, setSelectedAction] = useState(null)
  const [version, setVersion] = useState('')
  const [mode, setMode] = useState('hotfix')
  const [branchType, setBranchType] = useState('sustentacao')
  const [branchUs, setBranchUs] = useState('')
  const [branchName, setBranchName] = useState('')
  const [lines, setLines] = useState([])
  const [running, setRunning] = useState(false)

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const branchPreview = branchUs.trim()
    ? `feature/${branchType}-${branchUs.trim()}-${branchName.trim()}`
    : `feature/${branchType}-${branchName.trim()}`

  function setupListeners() {
    window.api.removeListeners()
    setRunning(true)
    window.api.onOut(data => setLines(prev => [...prev, { text: data.trimEnd(), type: 'out' }]))
    window.api.onErr(data => setLines(prev => [...prev, { text: data.trimEnd(), type: 'err' }]))
    window.api.onDone(code => {
      const msg = code === 0 ? '✓ Concluído (código 0)' : `✗ Encerrado com código ${code}`
      setLines(prev => [...prev, { text: msg, type: 'system' }])
      setRunning(false)
    })
  }

  function handleModeSwitch(newMode) {
    if (running) return
    setMode(newMode)
    if (newMode === 'newbranch') {
      setSelectedAction(null)
      setVersion('')
    }
  }

  function handleProjectClick(project) {
    if (running) return
    setSelectedProject(prev => (prev === project ? null : project))
    setSelectedAction(null)
    setVersion('')
  }

  function handleActionClick(id) {
    if (running || !selectedProject) return
    setSelectedAction(prev => (prev === id ? null : id))
    setVersion('')
  }

  async function handleExecute() {
    if (!selectedProject || !selectedAction || !version.trim() || running) return
    const projectPath = `${BASE_PATH}\\${selectedProject}`
    setLines([{ text: `> [${selectedProject}] hf ${selectedAction} ${version.trim()}`, type: 'system' }])
    setupListeners()
    await window.api.run(selectedAction, version.trim(), projectPath)
  }

  async function handleOpenGitk() {
    if (!selectedProject || running) return
    const projectPath = `${BASE_PATH}\\${selectedProject}`
    setLines(prev => [...prev, { text: `> [${selectedProject}] gitk master`, type: 'system' }])
    await window.api.openGitk(projectPath)
  }

  async function handleCreateBranch() {
    if (!selectedProject || !branchName.trim() || running) return
    const projectPath = `${BASE_PATH}\\${selectedProject}`
    setLines([{ text: `> [${selectedProject}] criar branch: ${branchPreview}`, type: 'system' }])
    setupListeners()
    await window.api.run('new-branch', '', projectPath, {
      branchType,
      branchUs: branchUs.trim(),
      branchName: branchName.trim(),
    })
  }

  return (
    <div data-theme={dark ? 'dark' : 'light'} className="scanlines flex flex-col h-screen bg-zinc-50 text-zinc-800 dark:bg-[#0a0a0a] dark:text-zinc-100 p-6 gap-4 select-none">
      <Header dark={dark} onToggleTheme={() => setDark(d => !d)} />

      <ProjectSelector
        projects={PROJECTS}
        selected={selectedProject}
        onSelect={handleProjectClick}
        disabled={running}
      />

      <div className="border-t border-zinc-200 dark:border-zinc-900" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <ModeTabs mode={mode} onSwitch={handleModeSwitch} disabled={running} />
          {mode === 'hotfix' && (
            <Button
              variant="outline"
              color="amber"
              className="px-3 py-1.5 text-[11px] tracking-widest uppercase"
              onClick={handleOpenGitk}
              disabled={running || !selectedProject}
            >
              gitk master
            </Button>
          )}
        </div>

        {mode === 'hotfix' && (
          <HotfixPanel
            actions={ACTIONS}
            selectedAction={selectedAction}
            onActionClick={handleActionClick}
            version={version}
            onVersionChange={setVersion}
            onExecute={handleExecute}
            running={running}
            disabled={!selectedProject}
          />
        )}

        {mode === 'newbranch' && (
          <NewBranchPanel
            branchTypes={BRANCH_TYPES}
            branchType={branchType}
            onTypeChange={setBranchType}
            branchUs={branchUs}
            onUsChange={setBranchUs}
            branchName={branchName}
            onNameChange={setBranchName}
            branchPreview={branchPreview}
            onCreateBranch={handleCreateBranch}
            running={running}
            disabled={!selectedProject}
          />
        )}
      </div>

      <ConsoleOutput
        lines={lines}
        running={running}
        onClear={() => setLines([])}
      />
    </div>
  )
}
