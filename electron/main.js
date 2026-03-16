const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const { autoUpdater } = require('electron-updater')

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

let mainWindow = null

function getScriptPath() {
  if (app.isPackaged) {
    return path.join(app.getAppPath(), 'hf.ps1')
  }
  return path.join(__dirname, '..', 'hf.ps1')
}

function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    mainWindow?.webContents.send('update:checking')
  })

  autoUpdater.on('update-available', (info) => {
    mainWindow?.webContents.send('update:available', info.version)
  })

  autoUpdater.on('update-not-available', () => {
    mainWindow?.webContents.send('update:not-available')
  })

  autoUpdater.on('download-progress', (progress) => {
    mainWindow?.webContents.send('update:progress', Math.floor(progress.percent))
  })

  autoUpdater.on('update-downloaded', () => {
    mainWindow?.webContents.send('update:downloaded')
  })

  autoUpdater.on('error', (err) => {
    mainWindow?.webContents.send('update:error', err.message)
  })
}

function createWindow() {
  const iconPath = app.isPackaged
    ? path.join(app.getAppPath(), 'task-management.png')
    : path.join(__dirname, '..', 'task-management.png')

  mainWindow = new BrowserWindow({
    width: 900,
    height: 900,
    resizable: true,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  const isDev = !app.isPackaged

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => { mainWindow = null })
}

app.whenReady().then(() => {
  setupAutoUpdater()
  createWindow()

  if (app.isPackaged) {
    setTimeout(() => autoUpdater.checkForUpdates(), 3000)
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('update:download', () => {
  autoUpdater.downloadUpdate()
})

ipcMain.handle('update:install', () => {
  autoUpdater.quitAndInstall()
})

ipcMain.handle('run-command', (event, { action, version, projectPath, branchType, branchUs, branchName }) => {
  const scriptPath = getScriptPath()

  const args = [
    '-ExecutionPolicy', 'Bypass',
    '-NonInteractive',
    '-File', scriptPath,
    '-action', action,
  ]

  if (version) args.push('-version', version)
  if (branchType) args.push('-branchType', branchType)
  if (branchUs) args.push('-branchUs', branchUs)
  if (branchName) args.push('-branchName', branchName)

  const child = spawn('powershell.exe', args, {
    cwd: projectPath
  })

  child.stdout.setEncoding('utf8')
  child.stderr.setEncoding('utf8')

  child.stdout.on('data', (data) => {
    event.sender.send('ps:out', data)
  })

  child.stderr.on('data', (data) => {
    event.sender.send('ps:err', data)
  })

  child.on('close', (code) => {
    event.sender.send('ps:done', code)
  })

  return { ok: true }
})

ipcMain.handle('dialog:open-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (result.canceled) return null
  return result.filePaths[0]
})

ipcMain.handle('open-gitk', (_event, { projectPath }) => {
  const fetch = spawn('git', ['fetch', '--all'], { cwd: projectPath })
  fetch.on('close', () => {
    const child = spawn('gitk', ['master'], {
      cwd: projectPath,
      detached: true,
      stdio: 'ignore'
    })
    child.unref()
  })
  return { ok: true }
})
